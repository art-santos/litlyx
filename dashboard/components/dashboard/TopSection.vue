<script lang="ts" setup>

const activeProject = useActiveProject();
const { onlineUsers, stopWatching, startWatching } = useOnlineUsers();
onMounted(() => startWatching());
onUnmounted(() => stopWatching());


const { createAlert } = useAlert();

function copyProjectId() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');
    navigator.clipboard.writeText((activeProject.value?._id || 0).toString());
    createAlert('Success', 'Project id copied successfully.', 'far fa-circle-check', 5000);
}
</script>


<template>
    <div
        class="w-full px-6 py-2 lg:py-6 font-bold text-text-sub/40 flex flex-col xl:flex-row text-lg lg:text-2xl gap-2 xl:gap-12">

        <div class="flex gap-2 items-center text-text/90 justify-center md:justify-start">
            <div class="animate-pulse w-[1rem] h-[1rem] bg-green-400 rounded-full"> </div>
            <div class="poppins font-medium text-[1.2rem]"> {{ onlineUsers }} Online users</div>
        </div>

        <div class="grow"></div>

        <div class="flex md:gap-2 items-center md:justify-start flex-col md:flex-row">
            <div class="poppins font-medium text-lyx-text-darker text-[1.2rem]">Project:</div>
            <div class="text-lyx-text poppins font-medium text-[1.2rem]"> {{ activeProject?.name || 'Loading...' }} </div>
        </div>
        <div class="flex flex-col md:flex-row md:gap-2 items-center md:justify-start">
            <div class="poppins font-medium text-lyx-text-darker text-[1.2rem]">Project id:</div>
            <div class="flex gap-2">
                <div class="text-lyx-text poppins font-medium text-[1.2rem]">
                    {{ activeProject?._id || 'Loading...' }}
                </div>
                <div class="flex items-center ml-3">
                    <i @click="copyProjectId()" class="far fa-copy text-lyx-text hover:text-lyx-primary cursor-pointer text-[1.2rem]"></i>
                </div>
            </div>
        </div>
    </div>
</template>