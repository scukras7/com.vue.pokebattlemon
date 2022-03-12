<template>
    <div id="battleStats">
        <div>
            :L{{lvl}}
        </div>
        <div class="row">
            <div class="col-1">
                HP:
            </div>
            <div class="col-10 offset-1">
                <div class="healthContainer">
                    <div
                        id="healthMeter"
                        :style="healthCss"
                    >
                        {{remainingHp}}
                    </div>
                </div>
            </div>
        </div>
        <div class="textAlignCenter">
            {{remainingHp}}/{{totalHitPoints}}
        </div>
    </div>
</template>

<script>

    export default {
        name: 'HitPoints',
        components: {},
        props: {
            remainingHp: Number,
            totalHitPoints: Number,
            lvl: Number
        },
        data () {
            return {
                percentHpRemaining: 100,
                bgColor: '#53ea8e',
                healthCss: {
                    'background-color': this.bgColor,
                    color: 'transparent',
                    'border-radius': '25px',
                    width: '100%',
                    height: '5px'
                }
            }
        },
        created () {
            this.percentHpRemaining = 100
            this.updateCss(100)
        },
        watch: {
            remainingHp (hp) {
                this.percentHpRemaining = Math.round((hp / this.totalHitPoints) * 100)
            },
            percentHpRemaining (percent) {
                this.updateCss(percent)
            }
        },
        methods: {
            updateCss (percent) {
                console.log('PERCENT')
                console.log(percent)
                this.healthCss = {
                    'background-color': this.bgColor,
                    color: 'transparent',
                    'border-radius': '25px',
                    width: `${percent}%`,
                    height: '5px'
                }
            }
        }
    }

</script>

<style>

    .healthContainer {
        border: 1px solid #000;
        border-radius: 25px;
        height: 7px;
    }

    #battleStats {
        padding-top: 0.75em;
        padding-left: 0.75em;
        padding-right: 0.2em;
        /*
        color: #f2be1f;
        background-color: #f21f50;
        */
    }

</style>