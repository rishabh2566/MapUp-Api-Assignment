# MapUp Backend Intern Assessment

This is an Express-NodeJS Api which takes a really long linestring in the body and matches with a given set of lines to find which of these lines intersect with the linestring provided.
There are about 10k coordinates in longline given to us. And about 50 fixed lines whith wich they are to be matched .

The linestring can be thought of as the route/path for vehicles, while the fixed lines can be obstacles or tolls;

Geometries from turfjs for mapping are used in this project. https://turfjs.org/docs/
Valid input for Post request : A linestring json object.

The API returns: 
1) An empty array [] if there are no intersections.
OR
2) Array of intersecting line id along with the point of intersections

## Setup
Install : 
```bash
npm install node
npm install express
npm install @turf/turf
npm install perf-hooks
```
Run surver :

```bash
node index.js
```


- Used POSTMAN Api client for launching http requests to test the Api. On http://localhost:3000/api .
- In Postman, Set authorisation to Basic Auth. Set User to 'test' and password to 'test'. See screenshot 5.
- Upload Json in body of post request. (long-ls.json)

### Screenshots
Screenshot 1 -
The given json file returns an empty array as there are no point of intersections between the two linestrings;

Screenshot 5 - Setting authorisation to use api.

Screenshot 2 and 3 - 
We can see in the map visual that this is indeed true. The edges of the red line are the fixedlines(as end point of lines are close enough). 
And the black line is the path. Since no edge lie on the black line. The path crossed none of the fixed lines.

Screenshot 4  [BONUS TASK] -
Compares of performance of improved algorithm.

### OUTPUT
```bash
# Server listening on port 3000
# PerformanceEntry {
#   name: 'test-api',
#   entryType: 'measure',
#   startTime: 8555.522031,
#   duration: 1370.361835 }
# PerformanceEntry {
#   name: 'Alternantive algo (Bonus task)',
#   entryType: 'measure',
#   startTime: 9935.694768,
#   duration: 15.162761 }
```

Long LineString and scattered lines samples
  ** download 1: https://bit.ly/3oiCONX
  ** download 2: https://bit.ly/3krGkTN
  
