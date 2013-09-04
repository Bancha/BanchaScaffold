!! use " on windows and ' on linux!!
!usage: gema -f gema-production-patterns.js -p "DEBUG_LEVEL=${debug_level}" old.js new.js
! "\s" mean one space

! hide debug stuff
\/\/IFDEBUG*ENDIF=
\/\/\sIFDEBUG*ENDIF=
\/\*IFDEBUG*ENDIF\*\/=
\/\*IFDEBUG*ENDIF\s\*\/=
\/\*\sIFDEBUG*ENDIF\*\/=
\/\*\sIFDEBUG*ENDIF\s\*\/=

! display production stuff
\/\/IFPRODUCTION*\/\/ENDIF=$1
\/\/IFPRODUCTION*\/\/\sENDIF=$1
\/\/\sIFPRODUCTION*\/\/ENDIF=$1
\/\/\sIFPRODUCTION*\/\/\sENDIF=$1
\/\*IFPRODUCTION*ENDIF\*\/=$1
\/\*IFPRODUCTION*ENDIF\s\*\/=$1
\/\*\sIFPRODUCTION*ENDIF\*\/=$1
\/\*\sIFPRODUCTION*ENDIF\s\*\/=$1

! console infos are not needed in production mode
console.info(*)\;=