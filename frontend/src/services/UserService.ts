import http from '@/http';
import { IError } from '@/models/IError';
import { IUser } from '@/models/IUser';
import axios, { AxiosError } from 'axios';

function formatImage(data: ArrayBuffer) : string {
	var binary = '';
	var bytes = new Uint8Array(data);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++)
			binary += String.fromCharCode(bytes[i]);
	return 'data:image/png;base64,' + window.btoa(binary);
}

class UserService {
  async paginate(link: string) {
    return await http.get(link);
  }
  getUserById(id: number) {
    return http.get<IUser>(`/users/${id}`);
  }
  async getAvatarOfUser(userId: number): Promise<string> {
    const response = await http.get(`/users/${userId}/avatar`, { responseType: 'arraybuffer' });
		return formatImage(response.data);
  }
  async setMyAvatar(myUserId: number, avatar: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', avatar);
    const response = await http.put(`/users/${myUserId}/avatar`, formData, { responseType: 'arraybuffer' });
		return formatImage(response.data);
  }
  updateMe(attrs: Partial<IUser>) {
    return http.patch<Partial<IUser>>('/users', attrs);
  }
  async resetDefaultAvatar(myUserId: number): Promise<string> {
    const response = await http.delete(`/users/${myUserId}/avatar`, { responseType: 'arraybuffer' });
		return formatImage(response.data);
  }
  async getGameHistory(userId: number) {
    return await http.get(`/game/${userId}`);
  }
  async getGamePagination(userId: number, link: string) {
    return await http.get(link);
  }

  /* friends */

  async getFriendships(userId: number, status: string): Promise<number[]> {
    const friendships = await http.get(`/users/${userId}/friends?status=${status}`);
    let ids: number[] = [];
    friendships.data.forEach((friendship: any) => {
      ids.push(friendship.id);
    });
    return ids;
  }
  sendFriendRequest(applicantId: number, recipientId: number) {
    http.post(`/users/${applicantId}/friends/${recipientId}`);
  }
  acceptFriendship(applicantId: number, recipientId: number) {
    http.patch(`/users/${applicantId}/friends/${recipientId}`);
  }
  async endFriendship(applicantId: number, recipientId: number) {
    await http.delete(`/users/${applicantId}/friends/${recipientId}`);
  }

  usernameExists(username: string): Promise<boolean> {
    return http.head(`/username/${username}`).then( () => {
      return true; 
    }).catch( () => {
      return false;
    })
  }
}
export default new UserService();
