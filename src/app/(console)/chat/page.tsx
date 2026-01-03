import AI_Prompt from "@/src/components/console/chat/ai-prompt";

export default function ChatPage() {
    return (
        <div className="h-full relative w-full flex justify-center overflow-hidden">
            <div className="absolute w-full flex justify-center" style={{ top: 'calc(50% - 130px)' }}>
                <AI_Prompt />
            </div>
        </div>
    )
}