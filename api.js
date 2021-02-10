const express = require('express');
const turf    = require("@turf/turf");
const router  = express.Router();

const { performance, PerformanceObserver } = require("perf_hooks")
const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(entry)
  })
})
perfObserver.observe({ entryTypes: ["measure"], buffer: true })

/**
 * Takes a LineString and an array of lines and returns the intersecting point(s) and lineID.
 * @param {GeoJSON} line1 A LineString (path)
 * @param {GeoJSON} line2 An array of LineString (obstacle)
 * @returns {FeatureCollection<Point>} point(s) that intersect both
 * @example
 * var line1 = turf.lineString([[0, 0], [0, 2]], [[0, 2], [0, 4]], [[1, 4], [5,5]]);
 * var line2 = turf.lineString([[-1, 1], [1, 1]], [[99,99], [100,100]]);
 * 
 *@result [ {1 : [0,1]} ]
 * Explanation line(1) matches path at co ordeinates [0,1]
 */
router.use("/", (req, res) => {
  // given path from body of post request. (long-ls.json)
  let pathpoints = req.body.coordinates;
  var path = turf.lineString(pathpoints);
  // fixed lines => Scattered lines given in assesment document. https://bit.ly/3oiCONX
  var lines = require("./lines.js");

  try{
    performance.mark("example-start")
    var arr = findlineIntersection(lines, path);  
    performance.mark("example-end")
    performance.measure("test-api", "example-start", "example-end")
    
    performance.mark("bonus-start")
    var arr2 = bonustask(lines, pathpoints);
    performance.mark("bonus-end")
    performance.measure("Alternantive algo (Bonus task)", "bonus-start", "bonus-end")
  }
  catch(err){
    if (typeof (err) === 'string') {
      // custom application error
      return res.status(400).json({ message: err });
    }
    // default to 500 server error
    return res.status(500).json({ message: err.message });
  }

  res.send(arr);
});
/* 
* Helper function which find intersection between path and obstacle
* Uses 'lineIntersect' from turfJS which runs in time complexity O(M * N) where
* M -> points in path  N -> Number of lines(obstacle)
*/
function findlineIntersection(lines, path){
  var arr = [];
  for (var i in lines) {
    var line = lines[i].line.coordinates;
    var obstacle = turf.lineString(line);
    var cross = turf.booleanOverlap(path, obstacle);
    if(cross){
      var LineID = i + 1;
      arr.push({
        LineID : turf.lineIntersect(path, obstacle),
      });
    }
  }
  return arr;
}

/*
* Imporved algorithm which finds minimum distance from line(obstacle) and skips skips check on points 
* while the distance from point is less than closest obstacle
*/
function bonustask (lines, pathpoints){
    var arr = [];
    let minDist = 0;
    var lastpoint = 0;
    for (var i = 1; i < pathpoints.length; i++) {
      if(minDist < turf.distance(pathpoints[lastpoint], pathpoints[i-1])){
        lastpoint = i;
        minDist = 1e9;
        var path = turf.lineString([pathpoints[i], pathpoints[i-1]]);
        for (var i in lines) {
          // updating minDistance from obstacle
          var line = lines[i].line.coordinates;
          mindist = Math.min(minDist, turf.pointToLineDistance(pathpoints[i], line));
          // checking if path crosses obstacle
          var obstacle = turf.lineString(line);
          var cross = turf.booleanOverlap(path, obstacle);
          if(cross){
            var LineID = i + 1;
            arr.push({
                LineID : turf.lineIntersect(path, obstacle),
            });
          }
        }
      } 
    } 

  return arr;
}
  
module.exports = router;

/*
BONUS TASK
Algorithm improvement

The out-of-box implementation uses 'lineIntersect' from turfJS. 
It finds intersection of two lines by breaking them in pair of points and finding intersection for points in constact time.
https://github.com/Turfjs/turf/blob/c952c44a25cb9ceba82f140b2b0407d8484afac4/packages/turf-line-intersect/index.ts#L33

Since the line we process is close to a sorted list of points if measured from distance from 1st point.
We dont necessarily need to cross check every fixed lines in every interation while moving along path.

import distanceBetweenCoordinates as Dist
import minDistfromFixedLines as minDistfromToll

def FindIntersection():
  start = now = 0
  while (now < path.size()):
    if ( Dist(now, start) < minDist )
      //skip_check for toll
    else
      //check for toll
      //update minDistfromToll
    // adjust now and start
*/
