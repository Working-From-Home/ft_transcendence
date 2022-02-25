import http from '@/http';
import { IUser } from '@/models/IUser';

function formatImage(data: ArrayBuffer) : string {
	var binary = '';
	var bytes = new Uint8Array(data);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++)
			binary += String.fromCharCode(bytes[i]);
	return window.btoa(binary);
}

class UserService {
  getUserById(id: number) {
    return http.get<IUser>(`/users/${id}`);
  }
  async getAvatarOfUser(userId: number) : Promise<string> {
    // return http.get<Blob>(`/users/${userId}/avatar`);
    const response = await http.get(`/users/${userId}/avatar`, { responseType: 'arraybuffer' });
		return formatImage(response.data);
  }
  async setMyAvatar(myUserId: number, image: File) : Promise<string> {
    const response = await http.post(`/users/${myUserId}/avatar`, new FormData().append('avatar', image));
		return formatImage(response.data);
  }
  async resetDefaultAvatar(myUserId: number) : Promise<string> {
    const response = await http.delete(`/users/${myUserId}/avatar`);
		return formatImage(response.data);
  }
}
export default new UserService();
