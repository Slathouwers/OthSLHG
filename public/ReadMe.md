# REFERENCES:
I found a lot of resources helpfull in explaining BitBoard logic that is only used in chess but in othello/reversie as well to expedite valid move generation, position evaluation and general optimazation which is very much necessary for further AI implementation. Also, being somewhat new to javascript I used some resources to implement the patterns and modularity I'm more familiar with from other programming languages. Below you can find a list of references and resources I used in this application.

### Bitboard concept explained using Chess:
#### 64-bit bitboards chess: 
http://pages.cs.wisc.edu/~psilord/blog/data/chess-pages/rep.html
### Othello Move Generation using bitboards
#### Othello Bitboard:
https://www.hanshq.net/othello.html#bitboards (Language: c)
#### Ojthello Move generation:
https://www.hanshq.net/othello.html#bitboards  (Language: c)
#### Othello Position evaluation: 
https://www.hanshq.net/othello.html#eval  (Language: c)
### Bits and operators in js (operator converts to 32bit numeber!)
#### Bitwise operators in javascript:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
          
32-bit limitation and numbers in js so you have to split the bit board into upper and lower boards and fill up the 
counterpart when doing a shiftUp and shiftDown 

# DISCLAIMER: 
Some methods take A LOT of inspiration from https://github.com/kana/othello-js!!!

To the author my gratitude for challenging me to dig deeper into the world of bitmaps/-boards and expanding my understanding of bitwise operations in general :)
(TO BE HONEST: In my 10 years of (somewhat limited) programming experience I never took a second look at any of the bitwise operators I came across in learning Java, Matlab, Python, C/C++, Lisp/Racket, C#, Javascript... - I'm glad I finally did!)
