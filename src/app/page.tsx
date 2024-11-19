import Link from "next/link";
import { HTMLProps } from "react";
import TranscribeActionForm from "./transcribe-action-form";
import { Divider } from "./ui/divider";
import { H1, H2 } from "./ui/typography";

export default async function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center">
      <div className="min-w-96 mx-auto p-8 bg-white rounded drop-shadow">
        <H1>Transcribe</H1>

        <TranscribeActionForm />

        <Divider />

        <H2>Demo</H2>

        <MyLink href="/transcripts/a60ec53a-32df-4930-be47-ccffdafdf3d4">
          wildfires.mp3
        </MyLink>
        <MyLink href="/transcripts/44894593-949a-4bde-bda2-ea9287e5d3a6">
          steves.mp3
        </MyLink>
        <MyLink href="transcripts/3c4132c4-d26b-4094-9c59-704f49c89f7c">
          kids.mp3
        </MyLink>
      </div>
    </div>
  );
}

function MyLink(props: HTMLProps<HTMLAnchorElement>) {
  return (
    <Link className="text-blue-500 hover:underline block" href={props.href!}>
      {props.children}
    </Link>
  );
}
