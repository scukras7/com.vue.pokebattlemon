<template>
    <div id="landingPage" @click="onClickEnter">
        <div id="showDesktop">
            <div v-if="!loadVideo">
                <div id="staticLandingSvg">
                    <img :src="renderedSvg" alt="staticLanding"/>
                </div>
            </div>
            <div v-else>
                <video autoPlay muted playsInline id="pdAnim">
                    <source :src="videoSourceUrl" type="video/mp4"/>
                </video>
            </div>
        </div>
        <div id="showMobile">
            <div v-if="!loadVideo">
                <div id="staticLandingMobileSvg">
                    <img :src="renderedSvg" alt="staticLandingMobile"/>
                </div>
            </div>
            <div v-else>
                <video autoPlay muted playsInline id="pdAnimMobile">
                    <source :src="videoSourceUrl" type="video/mp4"/>
                </video>
            </div>
        </div>
    </div>
</template>

<script>

    import HttpService from '../services/HttpService'
    import routes from '../assets/json/routes.json'
    import BlankSVG from '../assets/svg/blankLanding.svg'
    import BlankMobileSVG from '../assets/svg/blankLandingMobile.svg'
    import LandingSVG from '../assets/svg/pokebattlemonStaticLanding.svg'
    import LandingMobileSVG from '../assets/svg/pokebattlemonStaticLandingMobile.svg'

    const determineIfMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    export default {
        name: 'Landing',
        components: {},
        data () {
            return {
                isMobile: true,
                loadVideo: false,
                videoSourceUrl: '',
                renderedSvg: BlankMobileSVG
            }
        },
        mounted () {
            this.isMobile = determineIfMobile()
            if (!determineIfMobile()) {
                this.renderedSvg = BlankSVG
            }
        },
        watch: {
            isMobile (nIsMobile) {
                let url = `${routes.server.fileserver.root}${routes.server.fileserver.connect}`

                HttpService.fileserverGet(url)
                    .then((res) => {
                        if (res.data.connected) {
                            url = `${process.env.VUE_APP_FILESERVER_REST_API_HOST}:${process.env.VUE_APP_FILESERVER_REST_API_PORT}${routes.server.fileserver.root}${routes.server.fileserver.resourcesLanding}`

                            if (nIsMobile && determineIfMobile()) {
                                url += '?isMobile=true'
                            }
                            this.videoSourceUrl = url
                            this.loadVideo = true
                        }
                    })
                    .catch(() => {
                        this.renderedSvg = determineIfMobile() ? LandingMobileSVG : LandingSVG
                    })
            }
        },
        methods: {
            onClickEnter () {
                this.$router.push(routes.client.battleSimulator)
            }
        }
    }

</script>

<style>

    @media only screen and (min-width: 1025px) {
        #showDesktop {
            display: block;
        }

        #showMobile {
            display: none;
        }

        #pdAnim {
            width: 100vw;
        }
    }

    @media only screen and (max-width: 1024px) {
        #showDesktop {
            display: none;
        }

        #showMobile {
            display: block;
        }

        #pdAnimMobile {
            width: 100vw;
        }
    }

    #staticLandingSvg {
        width: 100vw;
    }

    #staticLandingMobileSvg  {
        width: 100%;
    }

    #landingPage {
        cursor: pointer;
    }

</style>