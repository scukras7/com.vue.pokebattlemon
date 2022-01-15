<template>
    <div id="messages">
        {{message}}
    </div>
</template>

<script>

    export default {
        name: 'GeneralMessageBox',
        components: {},
        props: {
            message: String
        }
    }

</script>

<style>

    #messages {
        height: 1em;
        padding-top: 1em;
        padding-bottom: 1em;
        text-align: center;
        font-style: italic;
        font-weight: 700;
        color: #ff006a;
    }

</style>