import { Component, OnInit } from '@angular/core';
import { GetAllChattingsService } from '../../../http/get-all-chattings.service';
import { AuthenticationService } from '../../../commonServices/authentication.service';
import { TransferSingleCardService } from "../../../commonServices/transfer-single-card.service";
import { Router } from '@angular/router';
import { UploadMainChattingService } from '../../../http/image/upload-main-chatting.service';

import { LikeButtonService } from "../../../http/like-button-service";
@Component({
  selector: 'app-chatting-card',
  templateUrl: './chatting-card.component.html',
  styleUrls: ['./chatting-card.component.css'],
  providers: [GetAllChattingsService,AuthenticationService]
})
export class ChattingCardComponent implements OnInit {
  // userIsAuthenticated = false;
  currentName = '';
  selectedId = ''
  // TransferSingleCardService
  mainChattingList: any = []
  imagePath: String = "file:/balloon.jpg"
  cardId=''
  mainImageUrl: string = ''

  constructor(private getAllChatting: GetAllChattingsService,private authService: AuthenticationService,
              private transferService: TransferSingleCardService,private likeButtonService:LikeButtonService, private router: Router,
              private uploadMainImage: UploadMainChattingService) {}

  isAuthOwner(){
      if(this.authService.verifyToken()){
        this.currentName = this.authService.decodeToken()['name']
        for(let i =0; i < this.mainChattingList.length; i++) {
          if (this.mainChattingList[i].ownerName == this.currentName) {
            this.mainChattingList[i].isAuth = true
          }
        }
      }
    }

  goToEditPage(id) {
    this.router.navigate(['/mainChatting/edit', id])
  }

  transferValue(myIndex: any){
    this.transferService.singleCard = this.mainChattingList[myIndex]
  }



    addAuth(){
      for (let n = 0; n < this.mainChattingList.length; n ++){
        this.mainChattingList[n].isAuth = false;
      }
    }

    getAllChats() {
      this.getAllChatting.getAllChattings().subscribe(
        (data) => {
          this.mainChattingList = data
          this.addAuth()
          console.log(this.mainChattingList)
          this.isAuthOwner()
        },
        (error) => {
          console.log(error)
        }
      )
    }
  getCardId(myIndex){
    this.cardId = this.mainChattingList[myIndex]._id
  }
  like(cardIndex){
    this.getCardId(cardIndex)
      this.likeButtonService.likeImageId(this.cardId).subscribe((data) => {
        this.mainChattingList[cardIndex].likes = data['likes']
        // console.log('cheng gong')
        // console.log(data)
      }, (error) => {
        // console.log('shi bai')
      })
  }
  ngOnInit() {
    console.log(this.authService.verifyAdmin())
    this.mainImageUrl = this.uploadMainImage.baseUrl;
    this.getAllChats()
  }

  // test(msg) {
  //   alert('from chatting card component' + msg)
  // }

}
