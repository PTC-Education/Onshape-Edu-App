// Define you custom blocks

/*
Mate Values:
----------------------------------------
get mate values from assembly
*/
import fetch from 'node-fetch';

async function getMates() {
    try {
        const response = await fetch(`/api/getMateValues${window.location.search}`, { headers: { 'Accept': 'application/json' } })
        const featurestudios = await response.json();
        return featurestudios;
    } catch (error) {
        console.error(error);
    }
};

var mates = getMates();
console.log('mates = '+mates)

// function getMateNames() {
//     var mates = getMates();
//     var names = [];
//     for (let i = 0;i<mates['mateValues'].len;i++) {
//         names.push(mates['mateValues'][i]['mateName'])
//     };
//     return names;
// }
// var mateNames = getMateNames();
// console.log('names = '+mateNames)

Blockly.Blocks['matevalues'] = {
    init: function() {
      this.appendValueInput("Position")
          .setCheck(null)
          .appendField("Select mate and set position (in radians)")
          .appendField(new Blockly.FieldDropdown([["option1","foo"], ["option2","bar"], ["option3","OPTIONNAME"]]), "Mates");
      this.setInputsInline(false);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

/*
WAIT:
----------------------------------------
Input desired amount of seconds to wait 
*/

Blockly.Blocks['wait'] = {
  init: function() {
    this.appendValueInput("SECONDS")
        .setCheck("Number")
        .appendField("wait");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip('Wait specified ammout of seconds');
    this.setHelpUrl('');
  }
};



Blockly.Blocks['math_constants'] = {
    init: function() {
        var options = [
            ["\u03c0","PI"],
            ["e","E"],
            ["\u03c6","GOLDEN_RATIO"],
            ["sqrt(2)","SQRT2"],
            ["sqrt(\u00bd)","SQRT1_2"]
           ];
        this.appendDummyInput()
           // Pass the field constructor the options list, the validator, and the name.
            .appendField(new Blockly.FieldDropdown(options), 'CONSTANT');
        this.setOutput(true);
        this.setColour(220);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['math_singles'] = {
    init: function() {
        var options = [
            ["square root","ROOT"],
            ["abs","ABS"],
            ["-","NEG"],
            ["ln","LN"],
            ["log10","LOG10"],
            ["e^","EXP"],
            ["10^","POW10"]
        ]
        this.appendDummyInput()
           // Pass the field constructor the options list, the validator, and the name.
            .appendField(new Blockly.FieldDropdown(options), "OP");
        this.appendValueInput('NUM')
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(220);
        this.setTooltip("");
        this.setHelpUrl("");
    }
}


Blockly.Blocks['math_trigs'] = {
    init: function() {
        var options = [
            ["sin", "SIN"],
            ["cos", "COS"],
            ["tan", "TAN"],
            ["asin", "ASIN"],
            ["acos", "ACOS"],
            ["atan", "ATAN"],
            ["atan2", "ATAN2"]
        ];
        this.appendDummyInput()
           // Pass the field constructor the options list, the validator, and the name.
            .appendField(new Blockly.FieldDropdown(options), "OP");
        this.appendValueInput('NUM')
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(220);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};



Blockly.Blocks['math_rounds'] = {
    init: function() {
        var options = [
            ["round", "ROUND"],
            ["round down", "ROUNDDOWN"],
            ["round up", "ROUNDUP"]
        ];
        this.appendDummyInput()
           // Pass the field constructor the options list, the validator, and the name.
            .appendField(new Blockly.FieldDropdown(options), "OP");
        this.appendValueInput('NUM')
        this.setInputsInline(true);
        this.setOutput(true);
        this.setColour(220);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};



/*
FEATURE:
----------------------------------------
Create a new feature, establishing preconditions and action
*/


Blockly.Blocks['features'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Initialize Feature -- Name:")
        .appendField(new Blockly.FieldTextInput("FeatureBlocks Feature"), "featurename");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Preconditions");
    this.appendStatementInput("preconditions")
        .setCheck(null);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Define Feature's actions");
    this.appendStatementInput("actions")
        .setCheck(null);
    this.setColour(105);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};


Blockly.Blocks['feature'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("New Feature -- Name:")
          .appendField(new Blockly.FieldTextInput("FeatureBlocks Feature"), "featurename");
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("Define Feature's actions");
      this.appendStatementInput("actions")
          .setCheck(null);
      this.setColour(105);
      this.setTooltip("");
      this.setHelpUrl("");
    }
  };


/*
PRECONDITIONS:
----------------------------------------
Establishes the variable names for the preconditions
*/

Blockly.Blocks['preconditions'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("Array")
        .appendField("Feature Inputs");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip("No spaces in precondition variable name, please");
    this.setHelpUrl("");
  }
};






/*
OPSPHERE:
----------------------------------------
Create a new sphere feature, defined by diameter and center
position in [x,y,z]
*/

Blockly.Blocks['opsphere'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Create Sphere        ")
        .setAlign(Blockly.ALIGN_LEFT);
    this.appendValueInput("center_xyz")
        .appendField("Center [x,y,z]:")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("diameter")
        .setCheck("Number")
        .appendField("Diameter [d]:")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Create Sphere");
    this.setHelpUrl("");
  }
};






/*
FCUBOID:
----------------------------------------
Create a new cuboid feature, defined by corner1 and corner2
position in [x,y,z]
*/

Blockly.Blocks['fcuboid'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Create Cuboid        ")
        .setAlign(Blockly.ALIGN_LEFT);
    this.appendValueInput("corner1_xyz")
        .appendField("First Corner [x,y,z]:")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("corner2_xyz")
        .appendField("Second Corner [x,y,z]:")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Create a cube with two corner points");
    this.setHelpUrl("");
  }
};






/*
FCYLINDER:
----------------------------------------
Create a new cylinder feature, defined by radius and axial centerline
vector start and endpoints in [x,y,z]
*/

Blockly.Blocks['fcylinder'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Create cylinder        ")
        .setAlign(Blockly.ALIGN_LEFT);
    this.appendValueInput("top_xyz")
        .appendField("Top Center [x,y,z]:")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("bottom_xyz")
        .appendField("Bottom Center [x,y,z]:")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("radius")
        .setCheck("Number")
        .appendField("Radius [r]:")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Create a cylinder by specifying a vector and radius");
    this.setHelpUrl("");
  }
};






/*
FCONE:
----------------------------------------
Create a new cone feature, defined by top/bottom radius and axial centerline
vector start and endpoints in [x,y,z]
*/

Blockly.Blocks['fcone'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Create cone        ")
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendValueInput("top_xyz")
            .appendField("Top Center [x,y,z]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("bottom_xyz")
            .appendField("Bottom Center [x,y,z]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("topRadius")
            .setCheck("Number")
            .appendField("Top Radius:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("bottomRadius")
            .setCheck("Number")
            .appendField("Bottom Radius:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Create a cone by specifying a vector and also a top and bottom radius");
        this.setHelpUrl("");
    }
  };





/*
FELLIPSOID:
----------------------------------------
Create a new ellipsoid feature, defined by center position and 3 radial vectors in [x,y,z]
*/

Blockly.Blocks['fellipsoid'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('Create Ellipsoid        ')
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendValueInput("center_xyz")
            .appendField("Center [x,y,z]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("radial_xyz")
            .appendField("Radial Vectors [x,y,z]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Create an ellipsoid by specifying a center position and 3 radial vectors in [x,y,z]");
        this.setHelpUrl("");
    }
};





/*
UNIONALL:
----------------------------------------
Union all parts found in a Part Studio
*/

Blockly.Blocks['unionall'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Union All Parts");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Union all parts found in Part Studio");
    this.setHelpUrl("");    
  }
};





/*
SKETCH:
----------------------------------------
Create a new sketch feature, defined by sketch name and 
desired plane name.
*/

Blockly.Blocks['sketch'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Create a sketch named")
        .appendField(new Blockly.FieldTextInput("Sketch1"), "skname")
        .appendField("on plane")
        .appendField(new Blockly.FieldTextInput("Top"), "planename");
    this.appendStatementInput("SkEntities")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip("Name a sketch and specify the plane (only Top, Front, or Right for now)");
    this.setHelpUrl("");
  }
};





/*
SKCIRCLE:
----------------------------------------
Draw a new circle on surrounding sketch, defined by center position [x,y,z]
and radius.
*/

Blockly.Blocks['skcircle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Draw circle        ")
        .setAlign(Blockly.ALIGN_LEFT);
    this.appendValueInput("center_xy")
        .setCheck("Number")
        .appendField("Center [x,y]:")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput("radius")
        .setCheck("Number")
        .appendField("Radius [r]:")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(360);
    this.setTooltip("Draw a circle with center position and radius");
    this.setHelpUrl("");
  }
};





/*
SKRECTANGLE:
----------------------------------------
Draw a new rectangle on surrounding sketch, defined by corner1 and corner 2 in [x,y,z]
*/

Blockly.Blocks['skrectangle'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Draw a rectangle        ")
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendValueInput("first_corner_xy")
            .setCheck("Number")
            .appendField("First Corner [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("second_corner_xy")
            .setCheck("Number")
            .appendField("Second Corner [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("Draw a rectangle with two corners");
        this.setHelpUrl("");
    }
  };





/*
SKREGULARPOLYGON:
----------------------------------------
Draw a new polygon on surrounding sketch, defined by center position and first vertex 
position in [x,y,z] and number of sides
*/

  Blockly.Blocks['skregularpolygon'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Draw regular polygon        ")
        this.appendValueInput("center_xy")
            .setCheck("Number")
            .appendField("Center [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("vertex_xy")
            .setCheck("Number")
            .appendField("First Vertex [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("sides")
            .setCheck("Number")
            .appendField("Number of Sides:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("Draw a polygon with a center and first vertex position. Make sure to specify the number of sides.");
        this.setHelpUrl("");
    }
  };





/*
SKPOINT:
----------------------------------------
Draw a new point on surrounding sketch, defined position in [x,y]
*/

Blockly.Blocks['skpoint'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Draw point        ")
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendValueInput("position_xy")
            .appendField("Position [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.ALIGN_RIGHT;
        this.setColour(360);
        this.setTooltip("Draw point at defined [x,y] point");
        this.setHelpUrl("");
    }
  };





/*
SKLINESEGMENT:
----------------------------------------
Draw a new line on surrounding sketch, defined by vector start
and endpoint in [x,y,z]
*/
Blockly.Blocks['sklinesegment'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Draw line segment        ")
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendValueInput("start_xy")
            .setCheck("Number")
            .appendField("Start Position [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("end_xy")
            .setCheck("Number")
            .appendField("End Position [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("Draw a line following the vector [x1,y1,z1] to [x2,y2,z2]");
        this.setHelpUrl("");
    }
};





/*
SKLINESEGMENT:
----------------------------------------
Draw a new line on surrounding sketch, defined by vector start
and endpoint in [x,y,z]
*/
Blockly.Blocks['skpolyline'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Draw polyline        ")
            .setAlign(Blockly.ALIGN_LEFT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("Draw a line following the vector [x1,y1,z1] to [x2,y2,z2]");
        this.setHelpUrl("");
    }
};





/*
SKTEXT:
----------------------------------------
Draw supplied text on surrounding sketch, defined by corner1 and corner 2 in [x,y,z]
*/

Blockly.Blocks['sktext'] = {
init: function() {
    this.appendDummyInput()
        .appendField("Draw this text:")
        .appendField(new Blockly.FieldTextInput("Sketch1"), "text");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(360);
    this.setTooltip("Draw text on surrounding sketch");
    this.setHelpUrl("");
    }
};






/*
SKARC:
----------------------------------------
Draw a new arc on surrounding sketch, defined by start, mid, and end points in [x,y,z]
*/

Blockly.Blocks['skarc'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Draw an arc        ")
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendValueInput("start_xy")
            .setCheck("Number")
            .appendField("Start Position [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("mid_xy")
            .setCheck("Number")
            .appendField("Middle Position [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("end_xy")
            .setCheck("Number")
            .appendField("End Position [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("Make sure to specify [x,y] for each point");
        this.setHelpUrl("");
    }
};






/*
SKELLIPTICALARC:
----------------------------------------
Draw a new elliptical arc on surrounding sketch, defined by center in [x,y,z],
major and minor radii, and start and end parameters
*/

Blockly.Blocks['skellipticalarc'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Draw elliptical arc        ")
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendValueInput("center_xy")
            .setCheck("Number")
            .appendField("Center [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("major_xy")
            .setCheck("Number")
            .appendField("Major Axis Unit Vector [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("majorRadius")
            .setCheck("Number")
            .appendField("Major Radius [mj_r]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("minorRadius")
            .setCheck("Number")
            .appendField("Major Radius [mn_r]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("startParameter")
            .setCheck("Number")
            .appendField("Start Parameter:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("endParameter")
            .setCheck("Number")
            .appendField("End Parameter:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("Make sure to fill out all of the parameters");
        this.setHelpUrl("");
    }
};





/*
SKELLIPSE:
----------------------------------------
Draw a new ellipse on surrounding sketch, defined by center in [x,y,z],
major and minor radii. 
*/

Blockly.Blocks['skellipse'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Draw ellipse        ")
            .setAlign(Blockly.ALIGN_LEFT);
        this.appendValueInput("center_xy")
            .setCheck("Number")
            .appendField("Center [x,y]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("majorRadius")
            .setCheck("Number")
            .appendField("Major Radius [mj_r]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.appendValueInput("minorRadius")
            .setCheck("Number")
            .appendField("Minor Radius [mn_r]:")
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("Make sure to supply all required points");
        this.setHelpUrl("");
    }
};




/*
EXTRUDE_STANDARD:
----------------------------------------
Extrude all sketches on sketch plane
*/

Blockly.Blocks['points'] = {
    validate: function(newValue) {
      this.getSourceBlock().updateConnections(newValue);
      return newValue;
    },
    
    init: function() {
      this.appendDummyInput()
      // Pass the field constructor the options list, the validator, and the name.
          .appendField(new Blockly.FieldTextInput("Enter number of points", this.validate), 'POINTS');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
    },
    
    updateConnections: function(newValue) {
        
        for (var i = 0; i < toString(newValue); i++) {
            this.appendValueInput('endDepth'+i)
        }
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
    }
};





/*
OPEXTRUDE:
----------------------------------------
Extrude all sketches on sketch plane
*/

Blockly.Blocks['opextrude'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Extrude from")
            .appendField(new Blockly.FieldTextInput("Sketch1"), "skname");
        this.appendValueInput("endDepth")
            .setCheck("Number")
            .appendField("by");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
        this.setTooltip("Tack on directly after a finished sketch");
        this.setHelpUrl("");
    }
  };





/*
EXTRUDE_STANDARD:
----------------------------------------
Extrude all sketches on sketch plane
*/

  Blockly.Blocks['extrude'] = {
    
    init: function() {
      var options = [
       ['Blind', 'BLIND'],
       ['Symmetric', 'SYMMETRIC']
      ];
    
      this.appendDummyInput()
      // Pass the field constructor the options list, the validator, and the name.
          .appendField(new Blockly.FieldDropdown(options), 'MODE');
      this.appendDummyInput('skname')
          .appendField('extrude')
          .appendField(new Blockly.FieldTextInput("Sketch1"), "skname");
      this.appendValueInput('endDepth')
          .appendField('by');
      this.appendStatementInput("SkEntities")
          .setCheck(null);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
    }
};





/*
REVOLVE:
----------------------------------------
REVOlVE first sketch about second sketch
*/

Blockly.Blocks['revolve'] = {
  init: function() {
    var options_axis = [
        ["x axis", "XAXIS"],
        ["y axis", "YAXIS"],
        ["z axis", "ZAXIS"]
    ];
    var options_units = [
        ["degree(s)", "DEGREE"],
        ["radian(s)", "RADIAN"]
    ];
    this.appendDummyInput()
      .appendField('Revolve')
      .appendField(new Blockly.FieldTextInput("Sketch1"), "skname");
   this.appendDummyInput()
      .appendField('about')
      .appendField(new Blockly.FieldDropdown(options_axis), "AXIS_MODE");
    this.appendValueInput("degrees")
      .appendField('by')
      .setCheck("Number")
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(options_units), "UNITS_MODE");
    this.appendStatementInput("SkEntities")
      .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};




/*
SWEEP:
----------------------------------------
Sweep sketch about the second sketch
*/

Blockly.Blocks['sweep'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Sweep the')
      .appendField(new Blockly.FieldTextInput("Sketch1"), "skname1");
   this.appendDummyInput()
      .appendField('profile about')
      .appendField(new Blockly.FieldTextInput("Sketch2"), "skname2")
      .appendField('path');
    this.appendStatementInput("SkEntities")
      .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
    this.setTooltip("");
    this.setHelpUrl("");
  }
};





/*
LOFT:
----------------------------------------
Loft sketch between second sketch offset from the first sketch
*/

Blockly.Blocks['loft'] = {
    init: function() {
      this.appendDummyInput()
        .appendField('Loft')
        .appendField(new Blockly.FieldTextInput("Sketch1"), "skname1");
     this.appendDummyInput()
        .appendField('to')
        .appendField(new Blockly.FieldTextInput("Sketch2"), "skname2")
      this.appendStatementInput("SkEntities")
        .setCheck(null);
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
      this.setTooltip("");
      this.setHelpUrl("");
    }
  };





/*
VECTOR2:
----------------------------------------
2D Vector 
*/

  Blockly.Blocks['vector2'] = {
    init: function() {
      this.appendValueInput("x")
          .setCheck("Number")
          .appendField("[")
      this.appendValueInput("y")
          .setCheck("Number")
          .appendField(",");
      this.appendDummyInput()
          .appendField("]")
      this.setInputsInline(true);
      this.setOutput(true);
      this.setColour(180);
      this.setTooltip("");
      this.setHelpUrl("");
    }
};



Blockly.Blocks['vector2Field'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("[")
          .appendField(new Blockly.FieldTextInput("0"), "x");
      this.appendDummyInput()
          .appendField(",")
          .appendField(new Blockly.FieldTextInput("0"), "y");
      this.appendDummyInput()
          .appendField("]")
      this.setInputsInline(true);
      this.setOutput(true);
      this.setColour(180);
      this.setTooltip("");
      this.setHelpUrl("");
    }
};


Blockly.Blocks['vector3'] = {
    init: function() {
        this.appendValueInput("x")
            .setCheck("Number")
            .appendField("[")
        this.appendValueInput("y")
            .setCheck("Number")
            .appendField(",");
        this.appendValueInput("z")
            .setCheck("Number")
            .appendField(",");
        this.appendDummyInput()
            .appendField("]")
      this.setInputsInline(true);
      this.setOutput(true,"String");
      this.setColour(180);
      this.setTooltip("");
      this.setHelpUrl("");
    }
};





Blockly.Blocks['vector3Field'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("[")
          .appendField(new Blockly.FieldTextInput("0"), "x");
      this.appendDummyInput()
          .appendField(",")
          .appendField(new Blockly.FieldTextInput("0"), "y");
      this.appendDummyInput()
          .appendField(",")
          .appendField(new Blockly.FieldTextInput("0"), "z");
      this.appendDummyInput()
          .appendField("]")
      this.setInputsInline(true);
      this.setOutput(true);
      this.setColour(180);
      this.setTooltip("");
      this.setHelpUrl("");
    }
};

  //-------------------------------------------------------------------------------------------------------------------------------------------------
  // TEST_FEATURES
  //-------------------------------------------------------------------------------------------------------------------------------------------------








Blockly.Blocks['plane'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Create Plane named")
          .appendField(new Blockly.FieldTextInput("Plane1"), "planename")
          .appendField("        ")
          .setAlign(Blockly.ALIGN_LEFT);
      this.appendValueInput("center_xyz")
          .appendField('Center [x,y,z]:')
          .setAlign(Blockly.ALIGN_RIGHT);
      this.appendValueInput("normal_xyz")
          .appendField("Normal Vector [x,y,z]:")
          .setAlign(Blockly.ALIGN_RIGHT);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(60);
      this.setTooltip("");
      this.setHelpUrl("");
    }
};



  Blockly.Blocks['extrude_upTo'] = {
    validate: function(newValue) {
      this.getSourceBlock().updateConnections(newValue);
      return newValue;
    },
    
    init: function() {
      var options = [
       ['Extrude up to next', 'UP_TO_NEXT'],
       ['Extrude up to surface', 'UP_TO_SURFACE'],
       ['Extrude up to body', 'UP_TO_BODY'],
       ['Extrude up to vertex', 'UP_TO_VERTEX'],
      ];
    
      this.appendDummyInput()
      // Pass the field constructor the options list, the validator, and the name.
          .appendField(new Blockly.FieldDropdown(options, this.validate), 'MODE')
          .appendField('using');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(60);
    },
    
    updateConnections: function(newValue) {
      this.removeInput('skname', true);
      if (newValue == 'UP_TO_NEXT') {
          this.appendDummyInput('skname')
              .appendField(new Blockly.FieldTextInput("Sketch1"), "skname")
      } else if (newValue == 'UP_TO_SURFACE') {
          this.appendDummyInput('skname')
              .appendField(new Blockly.FieldTextInput("Sketch1"), "skname")
      } else if (newValue == 'UP_TO_BODY') {
          this.appendDummyInput('skname')
              .appendField(new Blockly.FieldTextInput("Sketch1"), "skname")
      } else if (newValue == 'UP_TO_VERTEX') {
            this.appendDummyInput('skname')
             .appendField(new Blockly.FieldTextInput("Sketch1"), "skname")
      }
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(60);
    }
};



  Blockly.Blocks['entity_type'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Entity Type:")
              .appendField(new Blockly.FieldTextInput("BODY"), "type");
          this.setOutput(true, "String");
          this.setColour(60);
       this.setTooltip("Name an Entity Type (only BODY, FACE, EDGE, VERTEX)");
       this.setHelpUrl("");
        }
  };




  Blockly.Blocks['q_everything'] = {
    init: function() {
      this.appendValueInput('entity_type')
          .appendField('Query everything of');
      this.setColour(60);
      this.setInputsInline(true);
   this.setTooltip("Query everything of given entity type");
   this.setHelpUrl("");
    }
};



Blockly.Blocks['xaxis'] = {
    init: function() {
      this.appendValueInput('entity_type')
          .appendField('Query everything of');
      this.setColour(60);
      this.setInputsInline(true);
   this.setTooltip("Query everything of given entity type");
   this.setHelpUrl("");
    }
};


Blockly.Blocks['forLoop'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('For              ')
          .setAlign(Blockly.ALIGN_LEFT);
      this.appendValueInput('VARNAME')
          .appendField('Variable: ')
          .setAlign(Blockly.ALIGN_RIGHT);
      this.appendValueInput('Range')
          .appendField('Range [start, end]:')
          .setAlign(Blockly.ALIGN_RIGHT);
      this.appendValueInput('Increment')
          .appendField('Increment:')
          .setAlign(Blockly.ALIGN_RIGHT);
      this.appendStatementInput("loopEntities")
          .setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
      this.setTooltip("Name a sketch and specify the plane (only Top, Front, or Right for now)");
      this.setHelpUrl("");
    }
  }




  Blockly.Blocks['colorPart'] = {
    init: function() {
      this.appendDummyInput()
          .appendField('Set color of part        ')
          .setAlign(Blockly.ALIGN_LEFT);
      this.appendValueInput('red')
          .appendField('Red [r]:')
          .setAlign(Blockly.ALIGN_RIGHT);
      this.appendValueInput('green')
          .appendField('Green [g]:')
          .setAlign(Blockly.ALIGN_RIGHT);
      this.appendValueInput('blue')
          .appendField('Blue [b];')
          .setAlign(Blockly.ALIGN_RIGHT);
      this.appendValueInput('alpha')
          .appendField('Alpha [a]:')
          .setAlign(Blockly.ALIGN_RIGHT);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(270);
      this.setTooltip("Name a sketch and specify the plane (only Top, Front, or Right for now)");
      this.setHelpUrl("");
    }
  };