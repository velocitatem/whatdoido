var { Properties } = require('./internal_dependencies/properties')
var { behavioural_tensor } = require('./tensor_repository/tensors')

class Person {

  constructor(character_properties) {
    this.props = new Properties();
    this.character = character_properties;
  }

  emotionExpressedWPTStimuli( stimuli ) {
    var results = [];
    for(var i = 0 ; i < this.character.external_emotional_matrix.length; i += 1) {
      if(this.character.external_emotional_matrix[i][0] == stimuli) {
        results.push(this.character.external_emotional_matrix[i][1]);
      }
    }
    return results.length > 1 ? results : results[0];
  }

  emotionFeltWPTStimuli( stimuli ) {
    var results = [];
    for(var i = 0 ; i < this.character.internal_emotional_matrix.length; i += 1) {
      if(this.character.internal_emotional_matrix[i][0] == stimuli) {
        results.push(this.character.internal_emotional_matrix[i][1]);
      }
    }
    return results.length > 1 ? results : results[0];
  }

  behaviourGivenEmotion( emotion ) {
    var results = [];
    for(var i = 0 ; i < this.character.emotional_manifestations_matrix.length; i += 1) {
      if(this.character.emotional_manifestations_matrix[i][0] == emotion) {
        results.push(this.character.emotional_manifestations_matrix[i][1]);
      }
    }
    return results.length > 1 ? results : results[0];
  }

  simulateFullResponseToStimuli( stimuli ) {
    let emotional_response = this.emotionExpressedWPTStimuli(stimuli);
    let emotions_felt = this.emotionFeltWPTStimuli(stimuli);
    let action;
    if(emotions_felt.length > 1) {
      console.log(emotions_felt)
      action = [];
      for(var i = 0 ; i < emotions_felt.length ; i+=1) {
        let action_r = this.behaviourGivenEmotion(emotions_felt[i])
        if(Array.isArray(action_r)) {
          for(let j = 0; j < action_r.length; j +=1 ) {
            let action_rt = action_r[j]
            if(action.includes(action_rt) && action_rt == undefined && action_rt == null) {}
            else {action.push(action_rt)}
          }
        }
        else {
          if(action.includes(action_r) && action_r == undefined && action_r == null) {}
          else {action.push(action_r)}
        }
      }
      console.log(action)
    }
    else {
      action = this.behaviourGivenEmotion(emotions_felt);
    }
    var action_filtered = [];
    for(var i = 0 ; i < action.length ; i += 1) {
      if(action[i] != undefined) {
        action_filtered.push(action[i]);
      }
    }
    action = action_filtered
    let resultVector = [stimuli, emotions_felt, emotional_response, action];
    return resultVector;
  }


  vectorToReadableList(vector) {
    if(array.isarray(vector)) {
      var out = vector[0];
      for(var i = 1 ; i < vector.length - 1 ; i += 1) {
        out += ", " + vector[i]
      }
      out += " and " + vector[vector.length-1]
      return out;
    }
    else {
      return vector
    }
  }

  makeVerboseEasy(vector) {

    let partA = `If a subject is exposed to a situation that is ${vector[0].toLowerCase()} then`;
    let partB = vector[1] != undefined ? ` they will internally experience ${this.vectorToReadableList(vector[1])}` : "";
    let partC = vector[2] != undefined ? `. They will only display ${this.vectorToReadableList(vector[2])}` : "" ;
    let partD = vector[3] != undefined ? `. Their behaviour/symotoms will be ${this.vectorToReadableList(vector[3])}.` : "."
    return partA + partB + partC + partD
  }

  makeVerbose( vector ) {
    let out = ""
    for(var i = 0 ; i < vector.length - 1 ; i += 1) {
      out+=vector[i] + "\t >> \t"
    }
    out+=vector[vector.length-1];
    return out;
  }

}

var props = new Properties();
var subjectA = new Person(behavioural_tensor); // create a person object and load it with a behavioural tensor
var test_stimuli = props.stimuli.Negative_For_The_Future; // a sample stimuli to which the subject is exposed
console.log(subjectA.makeVerboseEasy(subjectA.simulateFullResponseToStimuli(test_stimuli)));
