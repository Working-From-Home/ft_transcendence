import http from '@/http';
import { IUser } from '@/models/IUser';

function formatImage(data: ArrayBuffer) : string {
	var binary = '';
	var bytes = new Uint8Array(data);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++)
			binary += String.fromCharCode(bytes[i]);
	return 'data:image/png;base64,' + window.btoa(binary);
}

class UserService {
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
  async resetDefaultAvatar(myUserId: number): Promise<string> {
    const response = await http.delete(`/users/${myUserId}/avatar`);
		return formatImage(response.data);
  }
  async getGameHistory(userId: number) {
    return await http.get(`/game/${userId}`);
  }
  async getFriendships(userId: number, status: string) {
    return await http.get(`/users/${userId}/friends?status=${status}`);
  }
  async getFriendshipStatus(applicantId: number, recipientId: number) {
    return await http.get(`/users/${applicantId}/friends/${recipientId}`);
  };
  sendFriendRequest(applicantId: number, recipientId: number) {
    http.post(`/users/${applicantId}/friends/${recipientId}`);
  }
  acceptFriendship(applicantId: number, recipientId: number) {
    http.patch(`/users/${recipientId}/friends/${applicantId}`);
  }
  async endFriendship(applicantId: number, recipientId: number) {
    await http.delete(`/users/${applicantId}/friends/${recipientId}`);
  }
}
export default new UserService();
