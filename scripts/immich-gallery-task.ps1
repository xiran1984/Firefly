[CmdletBinding(SupportsShouldProcess)]
param(
    [switch]$Register,
    [switch]$DryRun,
    [string]$EnvFile = (Join-Path $PSScriptRoot '../.env.immich-gallery')
)

$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$configFile = (Resolve-Path -LiteralPath $EnvFile).Path
$node = (Get-Command node.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1).Source
$syncScript = Join-Path $PSScriptRoot 'sync-immich-gallery.mjs'
$logFile = "$configFile.log"
$taskName = 'Firefly-Immich-Shengtu'

if ($Register) {
    if ($DryRun) { throw 'Use -Register -WhatIf to preview registration.' }
    if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
        throw "Task $taskName already exists. Inspect it before changing its registration."
    }

    $arguments = '--env-file "{0}" "{1}" "--log-file={2}"' -f $configFile, $syncScript, $logFile
    $action = New-ScheduledTaskAction -Execute $node -Argument $arguments -WorkingDirectory $repo
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Hours 1)
    $user = [Security.Principal.WindowsIdentity]::GetCurrent().Name
    $principal = New-ScheduledTaskPrincipal -UserId $user -LogonType Interactive -RunLevel Limited
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew `
        -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 45)

    if ($PSCmdlet.ShouldProcess($taskName, 'Register hourly gallery sync')) {
        Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings
    }
    return
}

$syncArgs = @('--env-file', $configFile, $syncScript)
if ($DryRun) {
    & $node @syncArgs '--dry-run'
} elseif ($PSCmdlet.ShouldProcess($taskName, 'Sync gallery to Vercel Blob')) {
    & $node @syncArgs "--log-file=$logFile"
}
exit $LASTEXITCODE
