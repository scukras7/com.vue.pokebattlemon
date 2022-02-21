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
                        :style="{
                            'background-color': bgColor,
                            'color': 'transparent',
                            'border-radius': '25px',
                            'width': percentHpRemaining,
                            'height': '5px' }"
                    >
                        {{hitPoints}}
                    </div>
                </div>
            </div>
        </div>
        <div class="textAlignCenter">
            {{hitPoints}}/{{totalHitPoints}}
        </div>
    </div>
</template>

<script>

    export default {
        name: 'HitPoints',
        components: {},
        props: {
            damagePoints: Number,
            totalHitPoints: Number,
            lvl: Number
        },
        data () {
            return {
                hitPoints: 0,
                percentHpRemaining: 100,
                bgColor: '#53ea8e'
            }
        },
        created () {
            this.hitPoints = this.totalHitPoints
            this.percentHpRemaining = 100
        },
        watch: {
            damagePoints (dp) {
                this.hitPoints -= dp
                this.percentHpRemaining = Math.round((this.hitPoints - dp) / this.totalHitPoints)
            }
        },
        methods: {}
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