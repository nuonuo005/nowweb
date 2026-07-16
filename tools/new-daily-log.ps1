param(
  [Parameter(Mandatory = $true)]
  [datetime]$Date,

  [Parameter(Mandatory = $true)]
  [string]$Slug,

  [Parameter(Mandatory = $true)]
  [string]$Title,

  [int]$Number = 1
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$templatePath = Join-Path $projectRoot "posts\_daily-log-template.html"
$dateText = $Date.ToString("yyyy-MM-dd")
$outputPath = Join-Path $projectRoot ("posts\{0}-{1}.html" -f $dateText, $Slug)

if (Test-Path -LiteralPath $outputPath) {
  throw "The daily log already exists: $outputPath"
}

$content = Get-Content -LiteralPath $templatePath -Raw -Encoding UTF8
$content = $content.Replace("{{DATE}}", $dateText)
$content = $content.Replace("{{TITLE}}", $Title)
$content = $content.Replace("{{NUMBER}}", $Number.ToString("000"))
$content = $content.Replace("{{DESCRIPTION}}", "Add today's work summary.")
$content = $content.Replace("{{READING_TIME}}", "About 5 minutes")
$content = $content.Replace("{{PROJECT_COUNT}}", "1")
$content = $content.Replace("{{INTRO}}", "Explain why this work mattered and the main lesson.")
$content = $content.Replace("{{PROJECT_TITLE}}", "Project title")
$content = $content.Replace("{{PROJECT_DESCRIPTION}}", "Explain what the project does.")
$content = $content.Replace("{{WORK_ITEM}}", "Describe today's implementation or repair.")
$content = $content.Replace("{{RESULT}}", "Add the final result, verification data, and next step.")

[System.IO.File]::WriteAllText($outputPath, $content, (New-Object System.Text.UTF8Encoding($false)))
Write-Output $outputPath
