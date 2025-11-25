import { auth, signOut } from "@/auth";
import exp from "constants";
import { LogOut } from "lucide-react";
import { defaultUrlTransform } from "react-markdown";
import { Button } from "@/components/ui/button";
const dashboard = async () => {
    const session = await auth();
    return (
        <div>
            {JSON.stringify(session)}
            <form action={async () =>{
                "use server"
                await signOut();
            }}>
            <button type="submit">
                Log out!
            </button>
            </form>
        </div>
    )
}

export default dashboard;
