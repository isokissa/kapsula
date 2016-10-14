Kapsula
=======

Once upon a time, I was programming games in machine language for Sinclair ZX81. 
One of my games won a 3rd prize in the competition for "Best program", organized
by a magazine for popular science. The game was written for ZX81 with 1KB RAM. 

This project is a reincarnation of the same game, written in JavaScript, as an 
exercise.  

The project is built and tested in continuous integration and the last 
version from master branch is automatically deployed to http://kapsula.isokissa.org 
Go there and play!

Design
------

One of the goals of this project is to prove that it is possible to make a 
fully testable arcade game. The software design allows clear layering of 
responsibilities. 

The core of the game logic lies in the class `KapsulaStepGame`. It is initialized
with randomness generator function and has simple interface for playing. There is 
only one method which accepts user's move and returns the information how the 
state is changed. There is also interface to retrieve full state, and current 
score. Class `KapsulaStepGame` takes care of pure game logic, without any notion 
of time. It can be used to implement also normal board games. 

Class `KapsulaArcadeGame` brings the timing aspect to the game, and takes care
of performing different animations in order to represent the states of the game. 
`KapsulaArcadeGame` also extends the state of game objects and introduces different
transition states, that are fun and interesting to see, but are irrelevant for
game logic and `KapsulaStepGame`. 

Class `KapsulaGameRenderer` is the class invoked by `KapsulaArcadeGame` and it 
takes care of representing the arcade game states in HTML, or more precisely in 
SVG (Scalable Vector Graphics) element of the main HTML page. 

Gengine - minimal game engine
----------------------------

H3: The Testing Aspect 

GameRunner is the only class that has notion of time, and it has also the 
infinite loop inside, which makes it a bit more interesting to test automatically. 
In order to test the infinite loop, of course we have to make sure that we can 
control the exit criteria, which means that the loop actually must not be infinite. 

There will be the method startLoop(), but also the endLoop(). In unit test
we will make sure that startLoop actually gets executed controlled number of times
and then stimulate the endLoop() method to regularly complete the test. 


