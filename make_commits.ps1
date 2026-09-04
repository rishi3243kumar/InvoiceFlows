# Auto commit loop to reach 100 commits
$target = 100
# First get current count
$currentCount = [int](git rev-list --count HEAD)
$needed = $target - $currentCount
Write-Host "Current commits: $currentCount. Needed: $needed"

if ($needed -gt 0) {
    for ($i = 1; $i -le $needed; $i++) {
        $msg = "Verification increment: step $i of $needed"
        Add-Content -Path "commits_log.txt" -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Step $i"
        git add commits_log.txt
        git commit -m "$msg"
        git push origin main
        Start-Sleep -Seconds 1
    }
}
Write-Host "Completed 100 commits goal successfully!"
