<template>
    <div class="mt-5 py-5 note" align="center">
        Don't refresh the page please!!
    </div>
</template>

<script>
export default {
    mounted() {
        const { result } = this.$route.query;
        if (parseInt(result) === 1) {
            this.$notify({
                group: 'alert',
                type: 'success',
                text: `You Make TopUp Successfully`,
                duration: 5000,
            })
        }
        else {
            this.$notify({
                group: 'alert',
                type: 'error',
                text: `TopUp Failed`,
                duration: 5000,
            })
        }
        // this.$router.push({ name: 'TopupCustomer' })
    },
}
</script>

<style lang="sass" scoped>
    .note
        font-size: 20px
        font-weight: 800
</style>