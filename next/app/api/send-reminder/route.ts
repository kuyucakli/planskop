// This is a public API endpoint that will be invoked by QStash.
// It contains the logic for the background job and may take a long time to execute.
import { testing } from '@/app/lib/actions';



export async function GET(request: Request) {
    const res = await testing();
    return Response.json(res);
}

