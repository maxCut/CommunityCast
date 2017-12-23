To run reveiver for test purposes run the following commands:

node index.js -- This will run the index.html page on port 3000 --

when deploying should run on https://communitycastsender.herokuapp.com/


MESSAGING PROTOCOL:

Since messages are only strings, use the following protocol
The first 8 characters of the string are the header

the first character is the message type

if type = 's'
the next 6 characters are the image id
the last character is a 1 if there is more info for the image coming
0 if this is the last packet for the image id.
