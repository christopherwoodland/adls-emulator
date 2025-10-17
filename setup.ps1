#!/usr/bin/env powershell

<#
.SYNOPSIS
ADLS Gen2 Emulator - Quick Start Script for Windows PowerShell

.DESCRIPTION
This script helps you quickly set up and run the ADLS Gen2 emulator on Windows.

.PARAMETER Action
The action to perform: 'install', 'start', 'test', or 'clean'

.EXAMPLE
./setup.ps1 -Action install
./setup.ps1 -Action start
./setup.ps1 -Action test
#>

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("install", "start", "test", "clean", "docker")]
    [string]$Action
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════════╗"
    Write-Host "║  $($Message.PadRight(62))  ║"
    Write-Host "╚════════════════════════════════════════════════════════════════╝"
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# Action: Install
function Install-Dependencies {
    Write-Header "Installing Dependencies"
    
    Write-Info "Checking Node.js installation..."
    try {
        $nodeVersion = node --version
        Write-Success "Node.js $nodeVersion found"
    } catch {
        Write-Error "Node.js not found. Please install from https://nodejs.org/"
        exit 1
    }
    
    Write-Info "Installing npm packages..."
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencies installed successfully"
    } else {
        Write-Error "Failed to install dependencies"
        exit 1
    }
}

# Action: Start
function Start-Emulator {
    Write-Header "Starting ADLS Gen2 Emulator"
    
    Write-Info "Checking if port 10000 is available..."
    $port = 10000
    $listening = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($listening) {
        Write-Error "Port $port is already in use"
        Write-Info "Try: netstat -ano | findstr :$port"
        exit 1
    }
    
    Write-Success "Port $port is available"
    Write-Info "Starting server..."
    Write-Host ""
    
    npm start
}

# Action: Test
function Run-Tests {
    Write-Header "Running Tests"
    
    Write-Info "Running test suite..."
    npm test
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "All tests passed!"
    } else {
        Write-Error "Some tests failed"
        exit 1
    }
}

# Action: Clean
function Clean-Project {
    Write-Header "Cleaning Project"
    
    Write-Info "Removing node_modules..."
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Info "Removing package-lock.json..."
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
    
    Write-Success "Project cleaned"
    Write-Info "Run 'setup.ps1 -Action install' to reinstall"
}

# Action: Docker
function Start-Docker {
    Write-Header "Starting with Docker"
    
    Write-Info "Checking Docker installation..."
    try {
        $dockerVersion = docker --version
        Write-Success "$dockerVersion found"
    } catch {
        Write-Error "Docker not found. Please install from https://www.docker.com/"
        exit 1
    }
    
    Write-Info "Building Docker image..."
    docker-compose build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to build Docker image"
        exit 1
    }
    
    Write-Success "Docker image built successfully"
    
    Write-Info "Starting container..."
    docker-compose up
}

# Main
Write-Host ""
Write-Host "ADLS Gen2 Emulator Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

switch ($Action) {
    "install" {
        Install-Dependencies
    }
    "start" {
        Start-Emulator
    }
    "test" {
        Run-Tests
    }
    "clean" {
        Clean-Project
    }
    "docker" {
        Start-Docker
    }
}

Write-Host ""
