Write-Host "Starting Java backend..."
Start-Process powershell -ArgumentList "cd backend; mvn spring-boot:run"

Write-Host "Starting Next.js frontend..."
Start-Process powershell -ArgumentList "cd frontend; npm run dev"
