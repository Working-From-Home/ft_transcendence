import http from '@/http';
import { IUser } from '@/models/IUser';

class UserService {
  getUserById(id: number) {
    return http.get<IUser>(`/users/${id}`);
  }
  getAvatarOfUser(userId: number) {
    // return http.get<Blob>(`/users/${userId}/avatar`);
    return http.get<ImageData>(`/users/${userId}/avatar`);
  }
  setMyAvatar(myUserId: number, image: File) {
    return http.post(`/users/${myUserId}/avatar`, new FormData().append('avatar', image));
  }
  resetDefaultAvatar(myUserId: number) {
    return http.delete(`/users/${myUserId}/avatar`);
  }
}
export default new UserService();
