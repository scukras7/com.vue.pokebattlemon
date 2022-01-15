<template>
    <div>
        <div>Battle Window</div>
        <div id="battleWindow" class="col-12">
            battle window
        </div>
        <p/>
        <div class="row justify-center">
            <q-btn
                color="white"
                text-color="black"
                label="Start Battle"
                :size="'xs'"
                class="col-6"
                @click="onClickStartBattle"
            />
        </div>
        <BattleMoves/>
        <BattleMessages/>
    </div>
</template>

<script>

    import BattleMoves from './BattleMoves'
    import BattleMessages from './BattleMessages'

    export default {
        name: 'BattleWindow',
        components: { BattleMoves, BattleMessages },
        methods: {
            onClickStartBattle () {
                this.$emit('startBattle', true)
            }
        }
    }

</script>

<style>

    #battleWindow {
        background-color: #afab9f;
        height: 50vh;
    }

</style>