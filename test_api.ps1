[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$loginBody = @{ email = "rohan@huddoerp.in"; password = "password123" } | ConvertTo-Json
$loginResp = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -UseBasicParsing
$loginJson = $loginResp.Content | ConvertFrom-Json
$token = $loginJson.data.access_token
Write-Host "=== Login ==="
Write-Host "Success: $($loginJson.success)"
Write-Host "Token (first 40): $($token.Substring(0,40))..."

$headers = @{ Authorization = "Bearer $token" }

# Test 1: Products
Write-Host "`n=== GET /api/v1/products ==="
$prodResp = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/products" -Headers $headers -UseBasicParsing
$prodJson = $prodResp.Content | ConvertFrom-Json
Write-Host "Success: $($prodJson.success)  Count: $($prodJson.data.Count)"

# Test 2: Product Categories
Write-Host "`n=== GET /api/v1/product-categories ==="
$catResp = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/product-categories" -Headers $headers -UseBasicParsing
$catJson = $catResp.Content | ConvertFrom-Json
Write-Host "Success: $($catJson.success)  Count: $($catJson.data.Count)"

# Get first product ID for edit test
$firstProd = $prodJson.data[0]
Write-Host "`n=== First Product ==="
Write-Host "ID: $($firstProd._id)  Name: $($firstProd.name)"

# Test 3: PUT /api/v1/products/:id (Product Edit)
Write-Host "`n=== PUT /api/v1/products/$($firstProd._id) ==="
$editBody = @{
    name = "$($firstProd.name) [Edited]"
    sku = $firstProd.sku
    description = "Updated via API test"
    is_active = $true
    category = $firstProd.category
} | ConvertTo-Json
$editResp = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/products/$($firstProd._id)" -Method PUT -ContentType "application/json" -Headers $headers -Body $editBody -UseBasicParsing
$editJson = $editResp.Content | ConvertFrom-Json
Write-Host "Success: $($editJson.success)  Message: $($editJson.message)"

# Test 4: GET /api/v1/country-managers/1/targets
Write-Host "`n=== GET /api/v1/country-managers/1/targets ==="
$targetResp = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/country-managers/1/targets" -Headers $headers -UseBasicParsing
$targetJson = $targetResp.Content | ConvertFrom-Json
Write-Host "Success: $($targetJson.success)  Targets count: $($targetJson.targets.Count)"

# Test 5: POST /api/v1/country-managers/1/targets
Write-Host "`n=== POST /api/v1/country-managers/1/targets ==="
$newTarget = @{
    target_type = "Monthly"
    target_period = "2026-07"
    revenue_target = 500000
    order_count_target = 200
    retailer_target = 10
    new_cities_target = 2
} | ConvertTo-Json
$postTargetResp = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/country-managers/1/targets" -Method POST -ContentType "application/json" -Headers $headers -Body $newTarget -UseBasicParsing
$postTargetJson = $postTargetResp.Content | ConvertFrom-Json
Write-Host "Success: $($postTargetJson.success)  Message: $($postTargetJson.message)"

# Verify POST saved targets successfully
Write-Host "`n=== GET /api/v1/country-managers/1/targets (Verification) ==="
$verifyResp = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/country-managers/1/targets" -Headers $headers -UseBasicParsing
$verifyJson = $verifyResp.Content | ConvertFrom-Json
Write-Host "Success: $($verifyJson.success)  Targets count: $($verifyJson.targets.Count)"
if ($verifyJson.targets.Count -gt 0) {
    $tgt = $verifyJson.targets[0]
    Write-Host "Grouped Target: Period: $($tgt.target_period)  Type: $($tgt.target_type)"
    Write-Host "Revenue Target: $($tgt.revenue_target)  Orders Target: $($tgt.order_count_target)  Retailers: $($tgt.retailer_target)"
}

Write-Host "`n=== All tests complete ==="
