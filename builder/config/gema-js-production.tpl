!! use " on windows and ' on linux!!
!usage: gema -f gema-production-patterns.js -p "DEBUG_LEVEL=${debug_level}" old.js new.js
! "\s" mean one space

! hide debug stuff
\/\/\<debug\>\n*\n\/\/\<\/debug\>= !remove debug statement, including new lines
\/\/\<debug\>*\/\/\<\/debug\>= !if new line is not recognized, do it without

! console infos are not needed in production mode
console.info(*)\;=
