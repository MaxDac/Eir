import {Injectable} from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {SessionTokens} from './dtos/session-tokens';
import {ApiException} from './dtos/api-exception';

@Injectable()
export class ForumService {
  constructor(
    private provider: HttpWrapperService,
    private authenticationService: AuthenticationService
  ) { }

  getSections(): Observable<ForumSection[] | ApiException> {
    return this.provider.get('/Forum/Sections', this.authenticationService.retrieveStoredSession());
  }

  getTopics(sectionId: number): Observable<ForumTopic[] | ApiException> {
    return this.provider.get(`/Forum/Topics/${sectionId}`, this.authenticationService.retrieveStoredSession());
  }

  getTopic(topicId: number): Observable<ForumTopic | ApiException> {
    return this.provider.get(`/Forum/Topic/${topicId}`, this.authenticationService.retrieveStoredSession());
  }

  getPosts(topicId: number): Observable<ForumPost[] | ApiException> {
    return this.provider.get(`/Forum/Posts/${topicId}`, this.authenticationService.retrieveStoredSession());
  }

  getPost(postId: number): Observable<ForumPost | ApiException> {
    return this.provider.get(`/Forum/Post/${postId}`, this.authenticationService.retrieveStoredSession());
  }

  createTopic(request: ForumTopicRequest): Observable<any | ApiException> {
    return this.provider.post('/Forum/Topic', request, this.authenticationService.retrieveStoredSession());
  }

  createPost(request: ForumPostRequest): Observable<any | ApiException> {
    return this.provider.post('/Forum/Post', request, this.authenticationService.retrieveStoredSession());
  }

  updateTopic(request: ForumTopicRequest): Observable<any | ApiException> {
    return this.provider.post('/Forum/Topic/Update', request, this.authenticationService.retrieveStoredSession());
  }

  updatePost(request: ForumPostRequest): Observable<any | ApiException> {
    return this.provider.post('/Forum/Post/Update', request, this.authenticationService.retrieveStoredSession());
  }

  deleteTopic(topicId: number): Observable<any | ApiException> {
    return this.provider.post(`/Forum/Topic/Delete/${topicId}`, null, this.authenticationService.retrieveStoredSession());
  }

  deletePost(postId: number): Observable<any | ApiException> {
    return this.provider.post(`/Forum/Post/Delete/${postId}`, null, this.authenticationService.retrieveStoredSession());
  }
}
