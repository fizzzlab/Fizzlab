$base = 'https://trackingweb-liard.vercel.app'

$routes = @(
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/admin',
  '/dashboard',
  '/connect',
  '/account',
  '/admin',
  '/admin/users',
  '/admin/sync',
  '/admin/analytics',
  '/api/admin/data?q=overview',
  '/api/admin/data?q=users',
  '/api/admin/data?q=sync-logs',
  '/api/admin/data?q=analytics',
  '/api/cron/weekly-sync'
)

Write-Host "=== Route Health Check: $base ==="
foreach ($path in $routes) {
  $url = "$base$path"
  try {
    $res  = Invoke-WebRequest -Uri $url -Method GET -MaximumRedirection 5 -UseBasicParsing -ErrorAction SilentlyContinue
    $code = $res.StatusCode
  } catch {
    $code = [int]$_.Exception.Response.StatusCode
  }
  $icon = if ($code -lt 400) { "[OK  $code]" } elseif ($code -eq 401) { "[AUTH $code]" } else { "[FAIL $code]" }
  Write-Host "$icon  $path"
}
