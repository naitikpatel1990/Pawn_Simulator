import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PawnServicesService } from 'src/app/services/pawn-services.service';

@Component({
  selector: 'app-pawn-control',
  templateUrl: './pawn-control.component.html',
  styleUrls: ['./pawn-control.component.scss'],
})
export class PawnControlComponent implements OnInit {

  pawnControl!: FormGroup;
  pawnCommands = ['place', 'move', 'left', 'right', 'report'];
  disablePlace = false;
  disableMove = false;
  DIRECTIONS = ['north', 'east', 'south', 'west'];
  COLORS = ['black', 'white'];
  CHESSPIECES = { pawn: { white: '&#x2659;', black: '&#x265F;' } };
  rows = 8;
  columns = 8;
  DIRECTIONAXIS = { north: 1, south: -1, west: -1, east: 1 };
  constructor(private fb: FormBuilder,private ps: PawnServicesService) { 
    
  }

  ngOnInit() {
    this.pawnControl =  this.fb.group({
      command: ['', Validators.required],
      x: [null, [Validators.min(0), Validators.max(7)]],
      y: [null, [Validators.min(0), Validators.max(7)]],
      steps: [null, [Validators.min(1), Validators.max(2)]],
      face: null,
      color: null,
    });
  }

  submit(){
    debugger;
    switch(this.pawnControl.value.command){
      case "place":
        this.addPiece()
      case "move": 
        this.movePiece(this.pawnControl.value.x, this.pawnControl.value.y,this.pawnControl.value.face, this.pawnControl.value.steps)
    }
      
    this.ps.pawnMovmentUpdate(this.pawnControl.value);
  }

  isPawnMoveValid(x, y) {
    return 0 <= x && x < this.rows && 0 <= y && y < this.columns;
  }

  addPiece() {
    this.ps.pawnMovmentUpdate(this.pawnControl.value);
  }

  movePiece(x,y,direction,steps?){
    const newXPos =
      +x + +this.getSteps(['west', 'east'], direction, steps);
    const newYPos =
      +y + +this.getSteps(['north', 'south'], direction, steps);
    if (this.isPawnMoveValid(newXPos, newYPos)) {
      const newPos = { x: newXPos, y: newYPos };
      let obj =  this.pawnControl.value;
      obj.x = newXPos;
      obj.y = newYPos;
      this.ps.pawnMovmentUpdate(obj);
    } 
  }

  getSteps(
    directions,
    currentDirection,
    steps: number,
  ) {
    return directions.includes(currentDirection)
      ? steps * this.DIRECTIONAXIS[currentDirection]
      : steps * 0;
  }


}
