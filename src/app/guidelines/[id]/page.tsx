import GuideQuestionForm from "./GuideQuestionForm";

interface GuidePageProps {
  params: { id: string };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guideId = params.id;

  return (
    <div style={{ padding: 20 }}>
      <h1>Kılavuz: {guideId}</h1>
      <p>Burada {guideId} ile ilgili bilgiler olabilir.</p>

      <GuideQuestionForm />
    </div>
  );
}
