import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useUpdateProfile = () => {

    const queryClient = useQueryClient();

    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch('/api/user/update/', {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify(formData),
				})
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
				queryClient.invalidateQueries({ queryKey: ["posts"] })
			])
		},
		onError: (error) => {
			toast.error(error.message);
		}
	})

    return {updateProfile, isUpdatingProfile}
}

export default useUpdateProfile