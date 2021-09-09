
// Helper Functions for Fetching ID data of the Blocks on the workspace
// ---------------------------------------------------------------------------------------------------------------------------------------------

//import { functions, } from './file.js';
// export { functions, }; // bottom of file.js

// Main ID fetching function for generating IDs in Loops 


/*
--------------------------------------------------------------------------------------

Get document info for block field definitions

This section of code outlines the helper functions which get data from Onshape for 
use in filling out fields

--------------------------------------------------------------------------------------
*/

/*
MateValues:
--------------------------------------------------------------------------------------
Adds a timed wait function. 
--------------------------------------------------------------------------------------
*/

/*
Testing direct code execution
*/

// Blockly.JavaScript['matevalues'] = function(block) {
//   var mateName = block.getFieldValue('mate');
//   var newPosition = Blockly.JavaScript.valueToCode(block, 'position', Blockly.JavaScript.ORDER_ATOMIC);
//   // TODO: Assemble JavaScript into code variable.
//   // await updateMatePosition(mateName,newPosition);
//   var code = 'updateMatePosition('+mateName+','+newPosition+');'
//   return code;
// };

/*
Passing JSON 
*/

Blockly.JavaScript['matevalues'] = function(block) {
  var mateName = block.getFieldValue('mate');
  var newPosition = Blockly.JavaScript.valueToCode(block, 'position', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  // await updateMatePosition(mateName,newPosition);
  var code = JSON.stringify({'mateName':mateName,'newPosition':newPosition})+';';
  return code;
};


/*
--------------------------------------------------------------------------------------

Blockly Block Traversal Code

This section of code outlines the helper functions which connect all of the necessary
FeatureScript information

--------------------------------------------------------------------------------------
*/


/*
GET-ALL-CHILDREN-BY-TYPE:
--------------------------------------------------------------------------------------
Input the block in question and specify a search type. Outputs an array of children
blocks that match the supplied type. [0] index is the closest child with matching type
--------------------------------------------------------------------------------------
*/

var getAllChildrenByType = function(block, type) {
  children = [];
  allChildren = block.getDescendants();
  for (var i = 0; i < allChildren.length; i++) {
    if (allChildren[i].type == type) {
      children.push(allChildren[i]);
    }
  }
  return children;
}

/*
GET-ALL-PARENTS-BY-TYPE:
--------------------------------------------------------------------------------------
Input the block in question and specify a search type. Outputs an array of parents
blocks that match the supplied type. [0] index is the closest parent with matching type
--------------------------------------------------------------------------------------
*/

var getAllParentsByType = function(block, type) {
  parents = [];
  while (true) {
    next_block = block.getSurroundParent()
    if (next_block == null) {
      return parents;
    } else if (next_block.type == type) {
      parents.push(next_block);
    }
    block = next_block
  }
};


/*
GET-PARENT-SKETCH-NAME:
--------------------------------------------------------------------------------------
Get the nearest parent sketch block's sketch name. 
--------------------------------------------------------------------------------------
*/

var getParentSketchName = function(blocks) {
  sketchBlock = getAllParentsByType(blocks, 'sketch')[0];
  return sketchBlock.getFieldValue('skname').toLowerCase();
};


/*
GET-PARENT-SKETCH-NAME:
--------------------------------------------------------------------------------------
Get the nearest parent sketch block with supplied Sketch name
--------------------------------------------------------------------------------------
*/

var getChildSketchWithName = function(blocks, skname) {
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].getFieldValue('skname').toLowerCase() == skname) {
      return blocks[i];
    }
  }
  return blocks;
};


/*
----------------------------------------------------------------------------------------------
*/



/*
--------------------------------------------------------------------------------------

FOR Loop Helper Functions

This section of code creates helper functions for correct addition of iterators to 
FeatureScript ids.

--------------------------------------------------------------------------------------
*/

/*
GETID:
--------------------------------------------------------------------------------------
Get the id for sk*, f*, and sketch blocks. This also checks if the block in question 
is in a for loop and adds the correct iterators on to the block for FS generation.
--------------------------------------------------------------------------------------
*/

var getID = function(block) {
  if (block.type == 'sketch') {
    generalID = block.getFieldValue('skname').toLowerCase();
    sketchID = undefined
  } else {
    generalID = block.type+ID() // Check the case of fcuboid, MAYBE add extraneous char in front
  }
  if (isInFOR(block)){
    iterators = getAllIterators(block);
    id = applyIterators(generalID, iterators);
  } else {
    id = `"`+generalID+`"`;
  } if (!(isSketchEntity(block))) {
    id = `id + ` + id;
  }
  return id;
}



/*
GET-OPERATION-ID:
--------------------------------------------------------------------------------------
Get the id for GeomOperation blocks. This also checks if the block in question 
is in a for loop and adds the correct iterators on to the block for FS generation.
--------------------------------------------------------------------------------------
*/

var getOperationID = function(block) {
    // Check the type for type specific parameters 
    if (block.type == 'extrude') {
      generalID = block.type+ID()
      sketchID = block.getFieldValue('skname').toLowerCase()
      descendantIndex = 2;
    } else if (block.type == 'revolve') {
      generalID = block.type+ID()
      sketchID = block.getFieldValue('skname').toLowerCase()
      descendantIndex = 2;
    }

    if (isSurroundingFOR(block, descendantIndex)) {
      Blockly.alert('GeomOperations must surround only sketch blocks! Restructure FOR block so that it is inside Sketch Block')
    }

    // Check if in a for loop and add iterators
    if (isInFOR(block)){
      iterators = getAllIterators(block);

      // Single selection extrude
      if (sketchID != undefined) {
        sketchID = applyIterators(sketchID, iterators);
        sketchID = `id + `+sketchID+``
      }
      id = applyIterators(generalID, iterators);
      id = `id + `+id+``
      
      ids = [id, sketchID]
      return ids

    } else {
      id = `"`+generalID+`"`;
    }
    
    if (!(isSketchEntity(block))) {
      id = `id + ` + id;
      sketchID = `id + "` + sketchID + `"`;   
    }
    
    ids = [id, sketchID]
    return ids;
  }


/*
IS-IN-FOR:
--------------------------------------------------------------------------------------
Checks to see if any parent blocks are FOR, returns true if it is inside a FOR loop
--------------------------------------------------------------------------------------
*/

var isInFOR = function(block) {
  var parents = getAllParentsByType(block, 'forLoop');
  if (parents.length == 0){
    return false;
  } else {  
    return true;
  }
}


/*
IS-SURROUNDING-FOR:
--------------------------------------------------------------------------------------
Checks to see if block in question directly surrounds a FOR loop. This function is used
in GeomOperation error checking to ensure FS generation.
--------------------------------------------------------------------------------------
*/

var isSurroundingFOR = function(block, descendantIndex) {
  var children = block.getDescendants()
  console.log(children)
  if (children.length == 0){
    return false;
  } else {  
    if (children[descendantIndex].type == 'forLoop'){
      return true;
    } else
    return false;
  }
}


/*
GET-ALL-ITERATORS:
--------------------------------------------------------------------------------------
Grabs the length of the FOR loops array and assigns all of the variables it finds.
--------------------------------------------------------------------------------------
*/

var getAllIterators = function(block) {
  iterators = []
  forLoops =  getAllParentsByType(block, 'forLoop');
  for (var i = 0; i < forLoops.length; i++) {
    iterators.push(Blockly.JavaScript.valueToCode(forLoops[i], 'VARNAME', Blockly.JavaScript.ORDER_ATOMIC));
    }
    return iterators;
  }


/*
APPLY-ITERATORS:
--------------------------------------------------------------------------------------
Takes in a generalID and iterators array and formats the for loop id
--------------------------------------------------------------------------------------
*/

var applyIterators = function(generalID, iterators) {
  id = `("`+generalID+`"`;
  for (var i = 0; i < iterators.length; i++) {
      id += ` ~ "`+iterators[i]+`" ~ floor(`+iterators[i]+`)`;
    }
  id += `)`;
  return id;
  };


/*
IS-SKETCH-ENTITY:
--------------------------------------------------------------------------------------
Checks if the block at hand is a sketch entity 
--------------------------------------------------------------------------------------
*/

var isSketchEntity = function(block) {
  if (block.type.slice(0,6) == 'sketch') {
    return false;
  } else if (block.type.slice(0,2) == 'sk') {
    return true;
  } else {
    return false;
  }
}


/*
ID:
--------------------------------------------------------------------------------------
ID generates a random string to append to new entity ids
--------------------------------------------------------------------------------------
*/

var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};


//-----------------------------------------------------------------------






/*
------------------------------------------------------------------------------------

BLOCKLY FEATURESCRIPT 

Below defines all of the callback functions for each Blockly block. Each block is titled
by its type and provided with a short description of the functionality 

-------------------------------------------------------------------------------------
*/




/*
WAIT:
--------------------------------------------------------------------------------------
Adds a timed wait function. 
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['wait'] = function(block) {
  var seconds = Blockly.JavaScript.valueToCode(block, 'SECONDS', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'wait('+seconds+');\n';
  return code;
};





/*
FEATURE:
--------------------------------------------------------------------------------------
Create a new feature. This block is the core for all of operation. It is the root block
and it required for successful featurescript creation. It is a double C block and must be

--------------------------------------------------------------------------------------
*/
/*
Blockly.JavaScript['feature'] = function(block) {
  var text_featurename = block.getFieldValue('featurename');
  var statements_preconditions = Blockly.JavaScript.statementToCode(block, 'preconditions');
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'actions');
  // TODO: Assemble JavaScript into code variable.
  if (statements_preconditions.length < 10) {
  var code = `
  annotation { "Feature Type Name" : "`+text_featurename+`" }
  export const myFeature = defineFeature(function(context is Context, id is Id, definition is map)
    precondition
    {
        // Define the parameters of the feature type
        `+statements_preconditions+`
    }
    {
        // Define the function's action
        `+statements_actions+`
    });
  `;
  }
  else {
  var code = `
  annotation { "Feature Type Name" : "`+text_featurename+`" }
  export const myFeature = defineFeature(function(context is Context, id is Id, definition is map)
    precondition
    {
        // Define the parameters of the feature type
        `+statements_preconditions+`
        // Define the function's action
        `+statements_actions+`
    });
  `;
  }
  return code;
};
*/

Blockly.JavaScript['feature'] = function(block) {
  var text_featurename = block.getFieldValue('featurename');
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'actions');
  // TODO: Assemble JavaScript into code variable.
  var code = `
  annotation { "Feature Type Name" : "`+text_featurename+`" }
  export const myFeature = defineFeature(function(context is Context, id is Id, definition is map)
    precondition
    {
        // Define the parameters of the feature type
    }
    {
        // Define the function's action
        `+statements_actions+`
    });
  `;
  return code;
};




Blockly.JavaScript['math_constants']= function(block) {
  options = {
    'PI':["PI",Blockly.JavaScript.ORDER_ATOMIC],
    'E':["exp(1)",Blockly.JavaScript.ORDER_ATOMIC],
    'GOLDEN_RATIO':["(1 + sqrt(5)) / 2",Blockly.JavaScript.ORDER_ATOMIC],
    'SQRT2':["sqrt(2)",Blockly.JavaScript.ORDER_ATOMIC],
    'SQRT1_2':["sqrt(1/2)",Blockly.JavaScript.ORDER_ATOMIC]
  };

  var constant = block.getFieldValue('CONSTANT');
  var code = ``+options[constant][0]+``
  return [code, Blockly.JavaScript.ORDER_NONE];
};




Blockly.JavaScript['math_singles']=function(block){
  options = {
    'ROOT':['sqrt',Blockly.JavaScript.ORDER_ATOMIC],
    'ABS':['abs',Blockly.JavaScript.ORDER_ATOMIC],
    'NEG':['-1*',Blockly.JavaScript.ORDER_ATOMIC],
    'LN':['log',Blockly.JavaScript.ORDER_ATOMIC],
    'LOG10':['log10',Blockly.JavaScript.ORDER_ATOMIC],
    'EXP':['exp',Blockly.JavaScript.ORDER_ATOMIC],
    'POW10':['10^',Blockly.JavaScript.ORDER_ATOMIC]
  }

  var op= block.getFieldValue("OP");
  var num = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC);
  var code = ``+options[op][0]+`(`+num+`)`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


Blockly.JavaScript['math_rounds']=function(block){
  options = {
    'ROUND':['floor',Blockly.JavaScript.ORDER_ATOMIC],
    'ROUNDDOWN':['floor',Blockly.JavaScript.ORDER_ATOMIC],
    'ROUNDUP':['ceil',Blockly.JavaScript.ORDER_ATOMIC]
  }

  var op= block.getFieldValue("OP");
  var num = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC);
  var code = ``+options[op][0]+`(`+num+`)`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};




Blockly.JavaScript['math_trigs']=function(block){
  options = {
    'SIN':['sin',Blockly.JavaScript.ORDER_ATOMIC],
    'COS':['cos',Blockly.JavaScript.ORDER_ATOMIC],
    'TAN':['tan',Blockly.JavaScript.ORDER_ATOMIC],
    'ASIN':['asin',Blockly.JavaScript.ORDER_ATOMIC],
    'ACOS':['acos',Blockly.JavaScript.ORDER_ATOMIC],
    'ATAN':['atan',Blockly.JavaScript.ORDER_ATOMIC],
    'ATAN2':['atan2',Blockly.JavaScript.ORDER_ATOMIC]
  }

  var op= block.getFieldValue("OP");
  var num = Blockly.JavaScript.valueToCode(block, 'NUM', Blockly.JavaScript.ORDER_ATOMIC);
  console.log(op.charAt(0))
  if (op.charAt(0) == 'A') {
    var code = ``+options[op][0]+`(`+num+`)`;
  }
  else {
    var code = ``+options[op][0]+`(`+num+` * degree)`;
  }
  return [code, Blockly.JavaScript.ORDER_NONE];
};

//case "ROUND":c="Math.round("+a+")";break;case "ROUNDUP":c="Math.ceil("+a+")";break;case "ROUNDDOWN":c="Math.floor("+a+")"






/*
PRECONDITIONS:
--------------------------------------------------------------------------------------
Create preconditions for FeatureScripts
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['preconditions'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = `
  annotation { "Name" : "`+value_name+`" }
  isInteger(definition.`+value_name+`, POSITIVE_COUNT_BOUNDS);
}
{
var `+value_name+` = definition.`+value_name+`;
  `
  return code;
};




/*
OPSPHERE:
--------------------------------------------------------------------------------------
Create a sphere 3D part
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['opsphere'] = function(block) {
  var value_diameter = Blockly.JavaScript.valueToCode(block, 'diameter', Blockly.JavaScript.ORDER_ATOMIC);
  var value_center_xyz = Blockly.JavaScript.valueToCode(block, 'center_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var blockID = getID(block);
  var code = `
    opSphere(context, `+blockID+`, {
        "radius": `+ value_diameter +` * inch,
        "center": `+value_center_xyz+` * inch
        });
  `
  return code;
};




/*
FCUBIOD:
--------------------------------------------------------------------------------------
Create a cuboid 3D part
--------------------------------------------------------------------------------------
*/
Blockly.JavaScript['fcuboid'] = function(block) {
  var value_corner1_xyz = Blockly.JavaScript.valueToCode(block, 'corner1_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var value_corner2_xyz = Blockly.JavaScript.valueToCode(block, 'corner2_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var blockID = getID(block);
  var code = `
  fCuboid(context, `+blockID+`, {
      "corner1": `+value_corner1_xyz+` * inch,
      "corner2": `+value_corner2_xyz+` * inch
      });
`
  return code;
};




/*
FCYLINDER:
--------------------------------------------------------------------------------------
Create a cylinder 3D part
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['fcylinder'] = function(block) {
  var value_bottom_xyz = Blockly.JavaScript.valueToCode(block, 'bottom_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var value_top_xyz = Blockly.JavaScript.valueToCode(block, 'top_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var value_radius = Blockly.JavaScript.valueToCode(block, 'radius', Blockly.JavaScript.ORDER_ATOMIC);
  var blockID = getID(block);
  var code = `
  fCylinder(context, `+blockID+`, {
      "topCenter": `+value_top_xyz+` * inch,
      "bottomCenter": `+value_bottom_xyz+` * inch,
      "radius" : `+value_radius+` * inch
      });
`
  return code;
};




/*
FCONE:
--------------------------------------------------------------------------------------
Create a cone 3D part
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['fcone'] = function(block) {
  var value_bottom_xyz = Blockly.JavaScript.valueToCode(block, 'bottom_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var value_top_xyz = Blockly.JavaScript.valueToCode(block, 'top_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var value_topRadius = Blockly.JavaScript.valueToCode(block, 'topRadius', Blockly.JavaScript.ORDER_ATOMIC);
  var value_bottomRadius = Blockly.JavaScript.valueToCode(block, 'bottomRadius', Blockly.JavaScript.ORDER_ATOMIC);
  var blockID = getID(block);
  var code = `
  fCone(context, `+blockID+`, {
      "topCenter": `+value_top_xyz+` * inch,
      "bottomCenter": `+value_bottom_xyz+` * inch,
      "topRadius" : `+value_topRadius+` * inch,
      "bottomRadius" : `+value_bottomRadius+` * inch
      });
`
  return code;
};




/*
FELLIPSOID:
--------------------------------------------------------------------------------------
Create an ellipsoid 3D part
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['fellipsoid'] = function(block) {
  var value_center_xyz = Blockly.JavaScript.valueToCode(block, 'center_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var value_radial_xyz = Blockly.JavaScript.valueToCode(block, 'radial_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var blockID = getID(block); 
  var code = `
  fEllipsoid(context, `+blockID+`, {
    "center" : `+value_center_xyz+` * inch,
    "radius" : `+value_radial_xyz+` * inch
  });
`
  return code;
};




/*
UNIONALL:
--------------------------------------------------------------------------------------
Union all parts within a part studio
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['unionall'] = function(block) {
  var code = `
    opBoolean(context, id + "boolean1", {
      "tools" : qUnion([qAllModifiableSolidBodies(), qAllModifiableSolidBodies()]),
      "operationType" : BooleanOperationType.UNION
    });
  `;
  return code;
};




/*
SKETCH:
---------------------------------------------------------------------------------------
Create a new sketch on the specified plane. This is a C block and requires the 
sketches to be inside in order for this block to correctly identify the child sketch names
---------------------------------------------------------------------------------------
*/

Blockly.JavaScript['sketch'] = function(block) {
  var text_skname = block.getFieldValue('skname').toLowerCase();
  var text_planename = block.getFieldValue('planename');
  var statements_skentities = Blockly.JavaScript.statementToCode(block, 'SkEntities');
  var blockID = getID(block); 

  if (text_planename == 'Top') {
    text_planename = 'makeId("Top")';
  } else if (text_planename == 'Front') {
    text_planename = 'makeId("Front")';
  } else if (text_planename == 'Right') {
    text_planename = 'makeId("Right")';
  } else {
    text_planename = `id + "`+text_planename.toLowerCase()+`"`;
  }
  var code = `
  var `+text_skname+` = newSketch(context,`+blockID+`, {
    "sketchPlane" : qCreatedBy(`+text_planename+`, EntityType.FACE)
});
// Create sketch entities here
`+statements_skentities+`
skSolve(`+text_skname+`);
  `;
  return code;
};




/*
SKCIRCLE:
--------------------------------------------------------------------------------------
Draw a circle
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['skcircle'] = function(block) {
  var value_c_vector = Blockly.JavaScript.valueToCode(block, 'center_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_r = Blockly.JavaScript.valueToCode(block, 'radius', Blockly.JavaScript.ORDER_ATOMIC);
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);
  var code = `
  skCircle(`+text_skname+`, `+blockID+`, {
    "center" : `+value_c_vector+` * inch,
    "radius" : `+value_r+` * inch  
});
  `;
  return code;
};




/*
SKRECTANGLE:
--------------------------------------------------------------------------------------
Draw a rectangle
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['skrectangle'] = function(block) {
  var value_startxy = Blockly.JavaScript.valueToCode(block, 'first_corner_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_endxy = Blockly.JavaScript.valueToCode(block, 'second_corner_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);

  var code = `
  skRectangle(`+text_skname+`, `+blockID+`, {
    "firstCorner" : `+value_startxy+` * inch,
    "secondCorner" : `+value_endxy+`* inch
  });
  `;
  return code;
};




/*
SKREGULARPOLYGON:
--------------------------------------------------------------------------------------
Draw a regular polygon
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['skregularpolygon'] = function(block) {
  var value_center_xy = Blockly.JavaScript.valueToCode(block, 'center_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_vertex_xy = Blockly.JavaScript.valueToCode(block, 'vertex_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_sides = Blockly.JavaScript.valueToCode(block, 'sides', Blockly.JavaScript.ORDER_ATOMIC);
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);

  var code = `
  skRegularPolygon(`+text_skname+`, `+blockID+`, {
    "center" : `+value_center_xy+` * inch,
    "firstVertex" : `+value_vertex_xy+` * inch,
    "sides" : `+value_sides+`
  });
  `;
  return code;
};




/*
SKPOINT:
--------------------------------------------------------------------------------------
Draw a point
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['skpoint'] = function(block) {
    var value_position_xy = Blockly.JavaScript.valueToCode(block, 'position_xy', Blockly.JavaScript.ORDER_ATOMIC);
    var text_skname = getParentSketchName(block);
    var blockID = getID(block);

    var code = `
    skPoint(`+text_skname+`, `+blockID+`, {
      "position" : `+value_position_xy+` * inch
  });
    `;
    return code; 
}




/*
SKLINE:
--------------------------------------------------------------------------------------
Draw a line segment
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['sklinesegment'] = function(block) {
  var value_start_xy = Blockly.JavaScript.valueToCode(block, 'start_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_end_xy = Blockly.JavaScript.valueToCode(block, 'end_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);

  var code = `
  skLineSegment(`+text_skname+`, `+blockID+`, {
    "start" : `+value_start_xy+` * inch,
    "end" : `+value_end_xy+` * inch
  });
  `;
  return code;
}




/*
SKPOLYLINE:
--------------------------------------------------------------------------------------
Draw a polyline by inputting an array of points
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['skpolyline'] = function(block) {
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);

  var code = `
  skPolyline(`+text_skname+`, `+blockID+`, {
    "points" : [
        vector( 0,  0) * inch,
        vector( 0, -1) * inch,
        vector( 1,  1) * inch,
        vector(-1,  0) * inch,
        vector( 0,  0) * inch
    ]
  });
  `;
  return code;
}



/*
POINTS:
--------------------------------------------------------------------------------------
Draw a polyline by inputting an array of points
-------------------------------------------------------------------------------------
*/

Blockly.JavaScript['points'] = function(block) {
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);

  var code = `
    "points" : [
        vector( 0,  0) * inch,
        vector( 0, -1) * inch,
        vector( 1,  1) * inch,
        vector(-1,  0) * inch,
        vector( 0,  0) * inch
    ]
  `;
  return code;
}







/*
SKARC:
--------------------------------------------------------------------------------------
Draw an arc
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['skarc'] = function(block) {
  var value_start_xy = Blockly.JavaScript.valueToCode(block,'start_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_mid_xy = Blockly.JavaScript.valueToCode(block,'mid_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_end_xy = Blockly.JavaScript.valueToCode(block,'end_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);

  var code = `  
  skArc(`+text_skname+`, `+blockID+`, {
    "start" : `+value_start_xy+` * inch,
    "mid" : `+value_mid_xy+` * inch,
    "end" : `+value_end_xy+` * inch
});
  `;
  return code;
}




/*
SKELLIPTICALARC:
--------------------------------------------------------------------------------------
Draw an elliptical arc
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['skellipticalarc'] = function(block) {
  var value_center_xy = Blockly.JavaScript.valueToCode(block,'center_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_major_xy = Blockly.JavaScript.valueToCode(block,'major_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_minorRadius = Blockly.JavaScript.valueToCode(block,'minorRadius', Blockly.JavaScript.ORDER_ATOMIC);
  var value_majorRadius = Blockly.JavaScript.valueToCode(block,'majorRadius', Blockly.JavaScript.ORDER_ATOMIC);
  var value_startParameter = Blockly.JavaScript.valueToCode(block,'startParameter', Blockly.JavaScript.ORDER_ATOMIC);
  var value_endParameter = Blockly.JavaScript.valueToCode(block,'endParameter', Blockly.JavaScript.ORDER_ATOMIC);
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);

  var code = `
  skEllipticalArc(`+text_skname+`, `+blockID+`, {
    "center" : `+value_center_xy+` * inch,
    "majorAxis" : normalize(`+value_major_xy+`),
    "minorRadius" : `+value_minorRadius+` * inch,
    "majorRadius" : `+value_majorRadius+` * inch,
    "startParameter" : `+value_startParameter+`,
    "endParameter" : `+value_endParameter+`
});
  `;
  return code;
}




/*
SKTEXT:
--------------------------------------------------------------------------------------
Draw the user supplied text
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['sktext'] = function(block) {
  var text_sktext = block.getFieldValue('text');
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);

  var code = `  
  skText(`+text_skname+`, `+blockID+`, {
    "text" : "`+text_sktext+`",
    "fontName" : "OpenSans-Regular.ttf"
});
  `;
  return code;
}




/*
SKELLIPSE:
--------------------------------------------------------------------------------------
Draw an ellipse
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['skellipse'] = function(block) {
  var value_center_xy = Blockly.JavaScript.valueToCode(block,'center_xy', Blockly.JavaScript.ORDER_ATOMIC);
  var value_majorRadius = Blockly.JavaScript.valueToCode(block,'majorRadius', Blockly.JavaScript.ORDER_ATOMIC);
  var value_minorRadius = Blockly.JavaScript.valueToCode(block,'minorRadius', Blockly.JavaScript.ORDER_ATOMIC);
  var text_skname = getParentSketchName(block);
  var blockID = getID(block);

  var code = `  
  skEllipse(`+text_skname+`, `+blockID+`, {
    "center" : `+value_center_xy+` * inch,
    "majorRadius" : `+value_majorRadius+` * inch,
    "minorRadius" : `+value_minorRadius+` * inch
});
  `;
  return code;
}







/*
EXTRUDE:
--------------------------------------------------------------------------------------
Mode select to choose between BLIND and SYMMETRIC. This is a C block and requires the 
sketches to be inside in order for this block to correctly identify the child sketch names
--------------------------------------------------------------------------------------
TO-DO: Add more extrude modes
*/

Blockly.JavaScript['extrude'] = function(block) {
  var text_skname = block.getFieldValue('skname').toLowerCase();
  var value_endDepth = Blockly.JavaScript.valueToCode(block, 'endDepth', Blockly.JavaScript.ORDER_ATOMIC);
  var text_mode = block.getFieldValue('MODE');
  var statements_skentities = Blockly.JavaScript.statementToCode(block, 'SkEntities');
  var ids = getOperationID(block);
  //console.log(ids)
  var code = `
  `+statements_skentities+`

  extrude(context, `+ids[0]+`, {
    "entities" : qSketchRegion(`+ids[1]+`),
    "endBound" : BoundingType.`+text_mode+`,
    "depth" : `+value_endDepth+` * inch
});
  `;
  return code;
};




/*
REVOLVE:
--------------------------------------------------------------------------------------
Revolve sketch profile about line segment defined axis. All axis helper functions are below
This is a C block and requires the sketches to be inside in order for this block to correctly
identify the child sketch names
--------------------------------------------------------------------------------------
*/
/*
Blockly.JavaScript['revolves'] = function(block) {
  
  var text_skname1 = block.getFieldValue('skname1').toLowerCase();
  var text_skname2 = block.getFieldValue('skname2').toLowerCase();
  var value_degrees = Blockly.JavaScript.valueToCode(block, 'degrees', Blockly.JavaScript.ORDER_ATOMIC);
  // Convert a line in the second sketch
  const [points, unitVector] = getAxisFromLine(block, text_skname2);
  var statements_skentities = Blockly.JavaScript.statementToCode(block, 'SkEntities');
  var revolveID = `revolve`+ID()+``;

  var code = `
  `+statements_skentities+`

  opRevolve(context, id + "`+revolveID+`", {
    "entities" : qSketchRegion(id + "`+text_skname1+`"),
    "axis" : line(vector(`+points[0]+`, `+points[1]+`, 0) * inch, vector(`+unitVector[0]+`, `+unitVector[1]+`, `+unitVector[2]+`)),
    "angleForward" : `+value_degrees+` * degree
});
  `;
  return code;
};
*/



Blockly.JavaScript['revolve'] = function(block) {
  options_axis = {
    'XAXIS':'line(vector(0,0,0),vector(1,0,0))',
    'YAXIS':'line(vector(0,0,0),vector(0,1,0))',
    'ZAXIS':'line(vector(0,0,0),vector(0,0,1))'
  }

  options_units = {
    'DEGREE':'degree',
    'RADIAN':'radian'
  }

  
  var text_skname = block.getFieldValue('skname').toLowerCase();
  //var text_skname2 = block.getFieldValue('skname2').toLowerCase();
  var text_axis = block.getFieldValue("AXIS_MODE")
  var text_units = block.getFieldValue("UNITS_MODE")
  var value_degrees = Blockly.JavaScript.valueToCode(block, 'degrees', Blockly.JavaScript.ORDER_ATOMIC);
  // Convert a line in the second sketch
  //const [points, unitVector] = getAxisFromLine(block, text_skname2);
  var statements_skentities = Blockly.JavaScript.statementToCode(block, 'SkEntities');
  //var revolveID = `revolve`+ID()+``;
  var ids = getOperationID(block);

  console.log(ids)

  var code = `
  `+statements_skentities+`

  opRevolve(context, `+ids[0]+`, {
    "entities" : qSketchRegion(`+ids[1]+`),
    "axis" : `+options_axis[text_axis]+`,
    "angleForward" : `+value_degrees+` * `+options_units[text_units]+`
});
  `;
  return code;
};



/*
---------------------------------------------------------------------------------------
REVOLVE HELPER FUNCTIONS:
---------------------------------------------------------------------------------------
The below helper functions are used to convert LineSegment block data to FeatureScript Axis
syntax. 

getUNITVECTOR:
--------------------------------------------------------------------------------------
Generates the unit vector denoted by the vector direction between two [x,y] points
--------------------------------------------------------------------------------------
TO-DO: Rounding correction
*/

var getUnitVector = function(coords) {
  del_x = coords[2] - coords[0];
  del_y = coords[3]- coords[1];
  unitVec = [del_x, del_y, 0];
  normUnitVec = normalizeVector(unitVec);
  return normUnitVec
};

/*
normalizeVECTOR:
--------------------------------------------------------------------------------------
Normalizes the unit vector for axis definition
--------------------------------------------------------------------------------------
*/

var normalizeVector = function(unitVec) {
  mag = Math.sqrt(unitVec[0]**2 + unitVec[1]**2);
  for (var i = 0; i < unitVec.length; i++) {
  unitVec[i] = unitVec[i]/mag;
}
  return unitVec;
}

/*
populateAxisCoordinates:
--------------------------------------------------------------------------------------
Obtains the inputs from line block to create an array to be parsed later
--------------------------------------------------------------------------------------
*/

var populateAxisCoordinates = function(block) {
  coords = [];
  startxy = Blockly.JavaScript.valueToCode(block[0], 'start_xy', Blockly.JavaScript.ORDER_ATOMIC).replace( /^\D+/g, '');
  endxy = Blockly.JavaScript.valueToCode(block[0], 'end_xy', Blockly.JavaScript.ORDER_ATOMIC).replace( /^\D+/g, '');
  startxy = startxy.substring(0, startxy.length - 1).split(', ');
  endxy = endxy.substring(0, endxy.length - 1).split(', ');
  coords[0] = convert_to_float(startxy[0]);
  coords[1] = convert_to_float(startxy[1]);
  coords[2] = convert_to_float(endxy[0]);
  coords[3] = convert_to_float(endxy[1]);
  return coords;
}

/*
getAxisFromLine:
--------------------------------------------------------------------------------------
Converts the line block data to the correct axis format
--------------------------------------------------------------------------------------
*/

var getAxisFromLine = function(block, skname) {
  childBlocks = getAllChildrenByType(block, 'sketch');
  sketchBlock = getChildSketchWithName(childBlocks, skname);
  lineBlock = getAllChildrenByType(sketchBlock, 'sklinesegment');
  points = populateAxisCoordinates(lineBlock);
  unitVector = getUnitVector(points);
  return [points, unitVector];
};

/*
Convert elements from string to float values
*/

function convert_to_float(b) {
  // Type conversion of string to float
  var floatValue = +(b);
  // Return float value
  return floatValue;
}
/*
---------------------------------------------------------------------------------------------------------
*/




/*
SWEEP:
--------------------------------------------------------------------------------------
Sweep sketch profile along second sketch. This is a C block and requires the sketches to
be inside in order for this block to correctly identify the child sketch names 
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['sweep'] = function(block) {
  
  var text_skname1 = block.getFieldValue('skname1').toLowerCase();
  var text_skname2 = block.getFieldValue('skname2').toLowerCase();
  // Convert a line in the second sketch
  var statements_skentities = Blockly.JavaScript.statementToCode(block, 'SkEntities');
  var sweepID = `sweep`+ID()+``;

  var code = `
  `+statements_skentities+`
  opSweep(context, id + "`+sweepID+`", {
    "profiles" : qSketchRegion(id + "`+text_skname1+`"),
    "path" : qCreatedBy(id + "`+text_skname2+`", EntityType.EDGE)
  });  
  `;
  return code;
};




/*
LOFT:
--------------------------------------------------------------------------------------
Loft between two user defined sketches. This is a C block and requires the sketches to
be inside in order for this block to correctly identify the child sketch names 
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['loft'] = function(block) {
  var text_skname1 = block.getFieldValue('skname1').toLowerCase();
  var text_skname2 = block.getFieldValue('skname2').toLowerCase();
  // Convert a line in the second sketch
  var statements_skentities = Blockly.JavaScript.statementToCode(block, 'SkEntities');
  var loftID = `loft`+ID()+``;

  var code = `
  `+statements_skentities+`
  opLoft(context, id + "`+loftID+`", {
    "profileSubqueries" : [ qSketchRegion(id + "`+text_skname1+`"), qSketchRegion(id + "`+text_skname2+`") ]
}); 
  `;
  return code;
};




/*
PLANE:
--------------------------------------------------------------------------------------
Create a plane at center [x,y,z] and normal to [x,y,z]
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['plane'] = function(block) {
  var value_center_xyz = Blockly.JavaScript.valueToCode(block, 'center_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var value_normal_xyz = Blockly.JavaScript.valueToCode(block, 'normal_xyz', Blockly.JavaScript.ORDER_ATOMIC);
  var text_planename = block.getFieldValue('planename').toLowerCase();
  var code = `
  opPlane(context, id + "`+text_planename+`", {
    "plane" : plane(`+value_center_xyz+` * inch, `+value_normal_xyz+`)
  });
  `;
  return code;
};




/*
VECTOR2:
--------------------------------------------------------------------------------------
VECTOR2 allows the user to use Blockly block as inputs for [x,y] coordinates 
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['vector2'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `vector(`+value_x+`, `+value_y+`)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};




/*
VECTOR2Field:
--------------------------------------------------------------------------------------
VECTOR2Field allows the user to type in [x,y] coordinates 
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['vector2Field'] = function(block) {
  var value_x = block.getFieldValue('x');
  var value_y = block.getFieldValue('y');
  var code = `vector(`+value_x+`, `+value_y+`)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};




/*
VECTOR3:
--------------------------------------------------------------------------------------
VECTOR3 allows the user to use Blockly block as inputs for [x,y,z] coordinates 
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['vector3'] = function(block) {
  var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  var value_z = Blockly.JavaScript.valueToCode(block, 'z', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `vector(`+value_x+`, `+value_y+`, `+value_z+`)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};




/*
VECTOR3Field:
--------------------------------------------------------------------------------------
VECTOR3Field allows the user to type in [x,y,z] coordinates 
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['vector3Field'] = function(block) {
  var value_x = block.getFieldValue('x');
  var value_y = block.getFieldValue('y');
  var value_z = block.getFieldValue('z');
  var code = `vector(`+value_x+`, `+value_y+`, `+value_z+`)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};




/*
FORLOOP:
--------------------------------------------------------------------------------------
FeatureScript FOR loop implementation. Catches if the range inputs are both negative
and adjusts logic accordingly. Parses the vector(x,x) input in order to get the value inputs.
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['forLoop'] = function(block) {
  var value_varName = Blockly.JavaScript.valueToCode(block, 'VARNAME', Blockly.JavaScript.ORDER_ATOMIC);
  var value_Range = Blockly.JavaScript.valueToCode(block, 'Range', Blockly.JavaScript.ORDER_ATOMIC);
  var value_Increment = Blockly.JavaScript.valueToCode(block, 'Increment', Blockly.JavaScript.ORDER_ATOMIC);
  value_Range = value_Range.replace(/[^0-9-]+/, '').replace(/\(|\)/g, "").split(",");
  var value_lowerRange = value_Range[0];
  var value_upperRange = value_Range[1];
  var statements_skentities = Blockly.JavaScript.statementToCode(block, 'loopEntities');
  if ((Math.sign(value_lowerRange) == -1) && (Math.sign(value_upperRange) == -1)) {
    var code = `
  for (var `+value_varName+` = `+value_lowerRange+`; `+value_varName+` >= `+value_upperRange+`; `+value_varName+` += `+value_Increment+`)
  {
    `+statements_skentities+`
  }
  `;
  } else {
  // TODO: Assemble JavaScript into code variable.
  var code = `
  for (var `+value_varName+` = `+value_lowerRange+`; `+value_varName+` <= `+value_upperRange+`; `+value_varName+` += `+value_Increment+`)
  {
    `+statements_skentities+`
  }
  `;
}
  return code;

};




/*
COLORPART:
--------------------------------------------------------------------------------------
Change the color of all solid bodies with the supplied RGBA values
--------------------------------------------------------------------------------------
*/

Blockly.JavaScript['colorPart'] = function(block) {
  var value_red = Blockly.JavaScript.valueToCode(block, 'red', Blockly.JavaScript.ORDER_ATOMIC);
  var value_green = Blockly.JavaScript.valueToCode(block, 'green', Blockly.JavaScript.ORDER_ATOMIC);
  var value_blue = Blockly.JavaScript.valueToCode(block, 'blue', Blockly.JavaScript.ORDER_ATOMIC);
  var value_alpha = Blockly.JavaScript.valueToCode(block, 'alpha', Blockly.JavaScript.ORDER_ATOMIC);
  var code = `
        setProperty(context, {
                   "entities" : qAllNonMeshSolidBodies(),
                   "propertyType" : PropertyType.APPEARANCE,
                   "value" : color(`+value_red+`, `+value_green+`, `+value_blue+`,`+value_alpha+`)
           });
  `;
  return code;

};




/*
-------------------------------------------------------------------------------------------
FEATURES IN DEVELOPMENT
-------------------------------------------------------------------------------------------
*/

Blockly.JavaScript['entity_type'] = function(block) {
  var text_entity_type = block.getFieldValue('type');
  var code = `
  EntityType.`+text_entity_type+`
  `;
  return code;
};



Blockly.JavaScript['q_everything'] = function(block) {
  var text_entities = Blockly.JavaScript.valueToCode(block, 'entity_type', Blockly.JavaScript.ORDER_ATOMIC);
  console.log(text_entities)
  var code = `
  qEverything(`+text_entities+`);
  `;
  return code;
};
