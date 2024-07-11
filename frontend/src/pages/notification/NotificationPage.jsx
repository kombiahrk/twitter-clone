import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaTrash, FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";

const NotificationPage = () => {

	const queryClient = useQueryClient();

	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notification");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) throw new Error(data.error || "something went wrong")
				return data;
			} catch (error) {
				throw new Error(error);
			}
		}
	})

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("api/notification", {
					method: "DELETE",
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "something went wrong")
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		}
	})

	const { mutate: deleteNotification, isPending: isDeleting } = useMutation({
		mutationFn: async (notificationId) => {
			try {
				const res = await fetch(`api/notification/${notificationId}`, {
					method: "DELETE",
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "something went wrong")
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notification deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		}
	})

	const handleDeleteNotification = (notificationId) => {
		if (isDeleting) return;
		deleteNotification(notificationId);
	};

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown dropdown-end'>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex gap-2 p-4 items-start'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<div className='avatar'>
								<Link to={`/profile/${notification.from.username}`} className='w-8 rounded-full overflow-hidden'>
									<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
								</Link>
							</div>
							<div className='flex flex-col flex-1'>
								<div className='flex gap-2 items-center'>
									<Link to={`/profile/${notification.from.username}`} className='font-bold'>
										{notification.from.fullName}
									</Link>
									<span className='text-gray-700 flex gap-1 text-sm'>
										<Link to={`/profile/${notification.from.username}`}>@{notification.from.username}</Link>
										<span>·</span>
										<span>{formatPostDate(notification.createdAt)}</span>
									</span>
									<span className='flex justify-end flex-1'>
										{!isDeleting && (
											<FaTrash className='cursor-pointer hover:text-red-500' onClick={() => handleDeleteNotification(notification._id)} />
										)}
										{isDeleting && (
											<LoadingSpinner size='sm' />
										)}
									</span>
								</div>
								{notification.type === "follow" ? "followed you" : "liked your post"}
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;