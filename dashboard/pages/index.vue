<script setup lang="ts">

definePageMeta({ layout: 'dashboard' });

const { data: projects } = useProjectsList();
const activeProject = useActiveProject();

const mainChartSelectIndex = ref<number>(1);
const sessionsChartSelectIndex = ref<number>(1);


const route = useRoute();


const limitsInfo = ref<{
    limited: boolean,
    maxLimit: number,
    limit: number,
    total: number,
    percent: number
}>();


onMounted(async () => {
    if (route.query.just_logged) return location.href = '/';
    limitsInfo.value = await $fetch<any>("/api/project/limits_info", signHeaders());
});


const { createAlert } = useAlert();


function copyProjectId() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');
    navigator.clipboard.writeText(activeProject.value?._id?.toString() || '');
    createAlert('Success', 'Project id copied successfully.', 'far fa-circle-check', 5000);
}


function copyScript() {
    if (!navigator.clipboard) alert('You can\'t copy in HTTP');


    const createScriptText = () => {
        return [
            '<script defer ',
            `data-project="${activeProject.value?._id}" `,
            'src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></',
            'script>'
        ].join('')
    }

    navigator.clipboard.writeText(createScriptText());
    createAlert('Success', 'Script copied successfully.', 'far fa-circle-check', 5000);
}

const firstInteractionUrl = computed(() => {
    return `/api/metrics/${activeProject.value?._id}/first_interaction`
});

const firstInteraction = useFetch<boolean>(firstInteractionUrl, {
    ...signHeaders(),
    lazy: true
});

const selectLabels = [
    { label: 'Hour', value: 'hour' },
    { label: 'Day', value: 'day' },
    // { label: 'Month', value: 'month' },
];



const { snapshot } = useSnapshot();

const refreshKey = computed(() => `${snapshot.value._id.toString() + activeProject.value?._id.toString()}`);

const pricingDrawer = usePricingDrawer();

function goToUpgrade() {
    pricingDrawer.visible.value = true;
}


</script>

<template>

    <div class="dashboard w-full h-full overflow-y-auto pb-20 md:pt-4 lg:pt-0">

        <div :key="'home-' + isLiveDemo()" v-if="projects && activeProject && firstInteraction.data.value">

            <div class="w-full px-4 py-2">


                <div v-if="limitsInfo && limitsInfo.limited"
                    class="w-full bg-[#fbbf2422] p-4 rounded-lg text-[.9rem] flex items-center">
                    <div class="flex flex-col grow">
                        <div class="poppins font-semibold text-[#fbbf24]">
                            Limit reached
                        </div>
                        <div class="poppins text-[#fbbf24]">
                            Litlyx cannot receive new data as you reached your plan's limit. Resume all the great
                            features and collect even more data with a higher plan.
                        </div>
                    </div>
                    <div>
                        <LyxUiButton type="outline" @click="goToUpgrade()"> Upgrade </LyxUiButton>
                    </div>

                </div>

            </div>

            <DashboardTopSection></DashboardTopSection>
            <DashboardTopCards :key="refreshKey"></DashboardTopCards>


            <div class="mt-6 px-6 flex gap-6 flex-col 2xl:flex-row">

                <CardTitled :key="refreshKey" class="p-4 flex-1 w-full" title="Visits trends"
                    sub="Shows trends in page visits.">
                    <template #header>
                        <SelectButton @changeIndex="mainChartSelectIndex = $event" :currentIndex="mainChartSelectIndex"
                            :options="selectLabels">
                        </SelectButton>
                    </template>
                    <div>
                        <DashboardVisitsLineChart :slice="(selectLabels[mainChartSelectIndex].value as any)">
                        </DashboardVisitsLineChart>
                    </div>
                </CardTitled>

                <!-- <CardTitled :key="refreshKey" class="p-4 flex-1 w-full" title="Sessions"
                    sub="Shows trends in sessions.">
                    <template #header>
                        <SelectButton @changeIndex="sessionsChartSelectIndex = $event"
                            :currentIndex="sessionsChartSelectIndex" :options="selectLabels">
                        </SelectButton>
                    </template>
                    <div>
                        <DashboardSessionsLineChart :slice="(selectLabels[sessionsChartSelectIndex].value as any)">
                        </DashboardSessionsLineChart>
                    </div>
                </CardTitled> -->

            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardWebsitesBarCard :key="refreshKey"></DashboardWebsitesBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardEventsBarCard :key="refreshKey"></DashboardEventsBarCard>
                    </div>
                </div>
            </div>


            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardReferrersBarCard :key="refreshKey"></DashboardReferrersBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardBrowsersBarCard :key="refreshKey"></DashboardBrowsersBarCard>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardOssBarCard :key="refreshKey"></DashboardOssBarCard>
                    </div>
                    <div class="flex-1">
                        <DashboardGeolocationBarCard :key="refreshKey"></DashboardGeolocationBarCard>
                    </div>
                </div>
            </div>

            <div class="flex w-full justify-center mt-6 px-6">
                <div class="flex w-full gap-6 flex-col xl:flex-row">
                    <div class="flex-1">
                        <DashboardDevicesBarCard :key="refreshKey"></DashboardDevicesBarCard>
                    </div>
                    <div class="flex-1">
                    </div>
                </div>
            </div>

        </div>

        <div v-if="!firstInteraction.data.value && activeProject" class="mt-[20vh] lg:mt-[36vh] flex flex-col gap-6">
            <div class="flex gap-4 items-center justify-center">
                <div class="animate-pulse w-[1.5rem] h-[1.5rem] bg-accent rounded-full"> </div>
                <div class="text-text/90 poppins text-[1.3rem] font-semibold">
                    Waiting for your first Visit or Event
                </div>
            </div>

            <div class="flex justify-center gap-10 flex-col lg:flex-row items-center lg:items-stretch px-10">

                <div class="bg-menu p-6 rounded-xl flex flex-col gap-2 w-full">
                    <div class="poppins font-semibold"> Copy your project_id: </div>
                    <div class="flex items-center gap-2">
                        <div> <i @click="copyProjectId()" class="cursor-pointer hover:text-text far fa-copy"></i> </div>
                        <div class="text-[.9rem] text-[#acacac]"> {{ activeProject?._id }} </div>
                    </div>
                </div>

                <div class="bg-menu p-6 rounded-xl flex flex-col gap-2 w-full lg:max-w-[40vw]">
                    <div class="poppins font-semibold">
                        Start logging visits in 1 click | Plug anywhere !
                    </div>
                    <div class="flex items-center gap-4">
                        <div> <i @click="copyScript()" class="cursor-pointer hover:text-text far fa-copy"></i> </div>
                        <div class="text-[.9rem] text-[#acacac] lg:w-min">
                            {{ `
                            <script defer data-project="${activeProject?._id}"
                                src="https://cdn.jsdelivr.net/gh/litlyx/litlyx-js/browser/litlyx.js"></script>` }}
                        </div>
                    </div>
                </div>

            </div>

            <NuxtLink to="https://docs.litlyx.com" target="_blank"
                class="flex justify-center poppins text-[1.2rem] text-accent gap-2 items-center">
                <div> <i class="far fa-book"></i> </div>
                <div class="poppins"> Go to docs </div>
            </NuxtLink>
        </div>


        <div class="text-text/85 mt-8 ml-8 poppis text-[1.2rem]" v-if="projects && projects.length == 0">
            Create your first project...
        </div>

    </div>

</template>

<style scoped lang="scss"></style>
