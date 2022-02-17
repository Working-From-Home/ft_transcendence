import { IChannel } from 'shared/models/socket-events';

export default {
	tmpRooms(context: any, payload: any){
		let rooms = [
			{
				roomId: 1,
				roomName: 'Room 1',
				messages: [{
					_id: 3,
					content: `Message in the room`,
					senderId: 4321,
					username: 'John Snow',
					avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
					date: '14 December',
					timestamp: '10:20',
					deleted: false,
				}],
				users: [
					{ 
						_id: payload.id,
						username: 'alesanto',
						avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
						status: {
							state: 'online',
							lastChanged: 'today, 11:30'
						  } 
					},
					{ 
						_id: 4321,
						username: 'John Snow',
						avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj',
						status: {
							state: 'online',
							lastChanged: 'today, 5:30'
						  }
					},
					{ 
						_id: 9999,
						username: 'Coco Pops',
						avatar: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi1.wp.com%2Fwilcity.com%2Fwp-content%2Fuploads%2F2020%2F06%2F115-1150152_default-profile-picture-avatar-png-green.jpg%3Ffit%3D820%252C860%26ssl%3D1&f=1&nofb=1',
						status: {
							state: 'offline',
							lastChanged: '14 July, 20:00'
						  }
					}
				],
			},
			{
				roomId: 2,
				roomName: 'Room 2',
				messages: [],
				users: [
					{ 
						_id: 4321,
						username: 'John Snow',
						avatar: 'https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj'
					},
					{ 
						_id: 9999,
						username: 'Coco Pops',
						avatar: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi1.wp.com%2Fwilcity.com%2Fwp-content%2Fuploads%2F2020%2F06%2F115-1150152_default-profile-picture-avatar-png-green.jpg%3Ffit%3D820%252C860%26ssl%3D1&f=1&nofb=1'
					}
				],
			},
		];
		return context.dispatch('fetchRooms', {
			...payload,
			rooms: rooms
		});
	},
	fetchRooms(context: any, payload: any){
		context.commit('fetchRooms', {
			rooms: payload.rooms,
		})
	},
	addMessage(context: any, payload: any) {
		context.commit('addMessage', {
			roomId: payload.roomId,
			newMessage: payload.newMessage
		});
	},
	leaveChannel(context: any, payload: any) {
		let rooms: IChannel[];
			rooms = [];
		context.commit('leaveChannel', {
			roomId: payload.roomId,
			userId: payload.UserId
		});
	}
};