export async function SlowlyDownyard() {
    const resp = await new Promise((resolve) => setTimeout(() => { resolve("ok") }, 5000));

    return (
        <p>Hello SlowlyDownyard</p>
    )
}