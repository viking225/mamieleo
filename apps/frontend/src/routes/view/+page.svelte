<script lang="ts">
import type { ViewProps } from "./$types";

    const {data}: ViewProps = $props()

    function checkValue(value: any) {
        console.log('value: ', value)
    }

</script>
<div class="container">
    {#await data.bookings}
        <p>Fetching data</p>
    {:then value}
        <div class="title-container">
            <h1>Reservations</h1>
        </div>
        <div class="bookings">{checkValue(value)}</div>
    {:catch error}
        <p>Data was not fetched {error.message}</p>
    {/await}
</div>
<style>

</style>
