@echo ON
echo Starting PHP copy paste...
echo.
call phpcpd workspace
call echo Caculating LOC...
echo.
call phploc workspace
echo Starting phpcbf ...
echo.
call phpcbf --standard=PSR2 --extensions=php workspace/modules
call echo Started Code sniffer...
echo.
call phpcs --warning-severity=6 --standard=PSR2 --extensions=php --ignore=*/migrations/* workspace/modules
call echo Started PHP Depend...
echo.
call pdepend --ignore=vendor --summary-xml=tmp/summary.xml --jdepend-chart=tmp/jdepend.svg --overview-pyramid=tmp/pyramid.svg workspace
call echo Started Static Analysis...
echo.
call phpmd workspace/public/index.php text static_analysis/md_rulesets/cleancode.xml,static_analysis/md_rulesets/naming.xml,static_analysis/md_rulesets/codesize.xml