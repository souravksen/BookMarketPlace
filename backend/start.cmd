@echo off
echo ============================================
echo   BookMarketplace Backend - Starting...
echo ============================================
echo.
echo Make sure MySQL is running and update
echo application.properties with your DB password.
echo.
echo Starting Spring Boot on http://localhost:8080
echo.
C:\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
pause
