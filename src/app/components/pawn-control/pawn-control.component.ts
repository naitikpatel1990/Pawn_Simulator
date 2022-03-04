import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PawnServicesService } from 'src/app/services/pawn-services.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pawn-control',
  templateUrl: './pawn-control.component.html',
  styleUrls: ['./pawn-control.component.scss'],
})
export class PawnControlComponent implements OnInit {

  isPawnPlaced = false;
  pawnControl: FormGroup;
  pawnCommands = ['place', 'move', 'left', 'right', 'report'];
  disablePlace = false;
  disableMove = false;
  DIRECTIONS = ['north', 'east', 'south', 'west'];
  COLORS = ['black', 'white'];
  CHESSPIECES = { pawn: { white: '&#x2659;', black: '&#x265F;' } };
  rows = 8;
  columns = 8;
  DIRECTIONAXIS = { north: 1, south: -1, west: -1, east: 1 };
  currentPosition: any;
  constructor(private fb: FormBuilder, private ps: PawnServicesService, private alertController: AlertController) {

  }

  ngOnInit() {
    this.initForm();

    this.pawnControl.valueChanges.subscribe(val => {
      if (val.command === 'place') {
        this.pawnControl.controls.x.setValidators([Validators.required, Validators.min(0), Validators.max(7)]);
        this.pawnControl.controls.y.setValidators([Validators.required, Validators.min(0), Validators.max(7)]);
      }
    })
  }

  initForm() {
    this.pawnControl = this.fb.group({
      command: ['', Validators.required],
      x: [{ value: null, disabled: true }],
      y: [{ value: null, disabled: true }],
      face: [{ value: null, disabled: true }],
      color: [{ value: null, disabled: true }],
    });
  }

  onCommand(ev) {
    if (ev.detail.value === 'place') {
      this.pawnControl.get('x').enable();
      this.pawnControl.get('y').enable();
      this.pawnControl.get('face').enable();
      this.pawnControl.get('color').enable();
    } else {
      this.pawnControl.get('x').disable();
      this.pawnControl.get('y').disable();
      this.pawnControl.get('face').disable();
      this.pawnControl.get('color').disable();
    }
  }

  submit() {
    switch (this.pawnControl.value.command) {
      case "place":
        this.addPawn();
        break;
      case "move":
        if (!this.isPawnPlaced) {
          this.showAlert("Please PLACE Pawn, first !!!");
          break;
        }
        let pawnPosition = this.currentPosition ? this.currentPosition : this.pawnControl.value;
        pawnPosition["command"] = this.pawnControl.value.command;
        pawnPosition["steps"] = 1;
        this.movePiece(pawnPosition.x, pawnPosition.y, pawnPosition.face, pawnPosition.steps)
        break;
      case "left":
        if (!this.isPawnPlaced) {
          this.showAlert("Please PLACE Pawn, first !!!");
          break;
        }
        this.toDirection(this.currentPosition, 'left');
        break;
      case "right":
        if (!this.isPawnPlaced) {
          this.showAlert("Please PLACE Pawn, first !!!");
          break;
        }
        this.toDirection(this.currentPosition, 'right');
        break;
      case "report":
        if (!this.isPawnPlaced) {
          this.showAlert("Please PLACE Pawn, first !!!");
          break;
        }
        this.showReport();
        break;
      default: return;
    }
  }

  checkPawnPlaced() {

    return true;
  }

  async showAlert(message) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });
    alert.present();
  }

  showReport() {
    const pawnPosition = this.currentPosition || this.pawnControl.value;
    const message = 'Facing ' + pawnPosition.face + ' from position xy :' + pawnPosition.x + "" + pawnPosition.y;
    this.showAlert(message);
  }

  toDirection(command, turn) {
    const directionRef = [...this.DIRECTIONS, ...this.DIRECTIONS];
    const index = directionRef.findIndex(
      (v, i) => i !== 0 && v === command.face,
    );
    // return directionRef[turn === 'left' ? index - 1 : index + 1];
    command["face"] = directionRef[turn === 'left' ? index - 1 : index + 1];
    this.currentPosition = command;
    this.ps.pawnMovmentUpdate(command);
  }

  isPawnMoveValid(x, y) {
    return 0 <= x && x < this.rows && 0 <= y && y < this.columns;
  }

  addPawn() {
    this.currentPosition = this.pawnControl.value;
    this.isPawnPlaced = true;
    this.ps.pawnMovmentUpdate(this.pawnControl.value);
  }

  movePiece(x, y, direction, steps?) {
    const newXPos =
      +x + +this.getSteps(['west', 'east'], direction, steps);
    const newYPos =
      +y + +this.getSteps(['north', 'south'], direction, steps);
    if (this.isPawnMoveValid(newXPos, newYPos)) {
      const newPos = { x: newXPos, y: newYPos };
      let obj = this.currentPosition ? this.currentPosition : this.pawnControl.value;
      obj.x = newXPos;
      obj.y = newYPos;
      this.currentPosition = obj;
      this.ps.pawnMovmentUpdate(obj);
    } else {
      alert("Cannot Move !!!");
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
