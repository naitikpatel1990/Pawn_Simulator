import { Component, OnInit } from '@angular/core';
import { PawnServicesService } from 'src/app/services/pawn-services.service';

interface Square {
  x: number;
  y: number;
  // piece?: Partial<Piece>;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})

export class BoardComponent implements OnInit {
  constructor(private ps: PawnServicesService) { 
    
  }
  rows = 8;
  cols = 8;
  info = [];
  CHESSPIECES = { pawn: { white: '&#x2659;', black: '&#x265F;' } };
  ngOnInit() {
    this.reset();
    this.ps.pawnServiceObs.subscribe((data) => {
      this.reset();
      const newPiece = {
        piece: {
          display:this.CHESSPIECES["pawn"][data.color],
          face: data.face
          }
        };
      this.info[data.x][data.y] = newPiece;
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
