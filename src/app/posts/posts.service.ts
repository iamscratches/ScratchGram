import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Post } from './post.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

const BACKEND_URL = environment.apiURL;

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[], postCount:number}>();

  constructor( private http: HttpClient, private router: Router){}

  getPosts(postsPerPage:number, currentPage:number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
    .get<{message:string, posts:any, maxposts:number }>(BACKEND_URL + 'posts' + queryParams)
    .pipe(map((postData) => {
      //console.log(postData);
        return {
          posts : postData.posts.map(post => {
            return {
              title : post.title,
              content : post.content,
              id : post._id,
              imagePath : post.imagePath,
              creator : post.creator
            };
          }),
          maxPosts: postData.maxposts
        };
    }))
    .subscribe((transformedPostsData) => {
      console.log(transformedPostsData);
      this.posts = transformedPostsData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostsData.maxPosts});
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image:File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{ message:string, post:Post }>(BACKEND_URL + 'posts', postData).subscribe(responseData => {
      this.router.navigate(["/"]);
    });

  }

  getPost(id:string){
    return this.http.get<{
      _id: string,
      title:string,
      content:string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL + 'posts/' + id);
  }

  updatePost(id:string, title:string, content:string, image: string | File){
    let postData: Post | FormData;
    if(typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id)
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    }
    else{
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }


    this.http.put(BACKEND_URL + 'posts/' + id, postData).subscribe(response => {
      this.router.navigate(["/"]);

    })

  }

  deletePost(postId:string){
    //console.log(postId);
    return this.http.delete(BACKEND_URL + 'posts/' + postId);
  }
}
