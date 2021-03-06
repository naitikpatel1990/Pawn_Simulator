import { Component, OnInit } from '@angular/core';
import { PawnServicesService } from 'src/app/services/pawn-services.service';

interface Square {
  x: number;
  y: number;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})

export class BoardComponent implements OnInit {
  constructor(private ps: PawnServicesService) { }
  rows : Number = 8;
  cols : Number = 8;
  info : Array<any> = [];
  CHESSPIECES = { pawn: { white: '&#x2659;', black: '&#x265F;' } };

  ngOnInit() {
    this.reset(); // Create bord

    // Subscribe service when any control called from pawn controller component
    this.ps.pawnServiceObs.subscribe((data) => {
      this.reset();
      const newPawn = {
        pawn: {
          display: this.CHESSPIECES["pawn"][data.color],
          face: data.face
        }
      };
      this.info[7 - data.y][data.x] = newPawn;
    });
  }

  reset() {
    this.info = [...Array(this.rows).keys()]
      .reverse()
      .map((y) =>
        [...Array(this.cols).keys()].map((x): Square => ({ x, y })),
      );
  }
}
