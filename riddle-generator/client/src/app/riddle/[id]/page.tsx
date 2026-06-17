"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BookOpen, Loader2, Lock } from 'lucide-react';
import { RiddleService } from '@/services/riddle.service';
import { RiddleDetail, CrosswordLayout } from '@/types/riddle';
import { Badge, BadgeVariant } from '@/components/atoms/Badge/Badge';
import { Button } from '@/components/atoms/Button/Button';
import { CrosswordResult } from '@/components/organisms/Chat/CrosswordResult/CrosswordResult';

function typeToVariant(type?: string): BadgeVariant {
  switch (type?.toUpperCase()) {
    case 'MATH': return 'warning';
    case 'LOGIC': return 'info';
    case 'DANETKI': return 'success';
    case 'CROSSWORD': return 'pink';
    default: return 'default';
  }
}

function ComplexityDots({ value }: { value: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: i < value ? 'var(--color-accent, #a78bfa)' : 'var(--color-border, #333)',
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  );
}

export default function RiddlePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [riddle, setRiddle] = useState<RiddleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    RiddleService.getRiddleById(id)
      .then(setRiddle)
      .catch((err: { response?: { status?: number } }) => {
        const status = err?.response?.status;
        if (status === 403) {
          setError('You do not have access to this riddle.');
        } else if (status === 404) {
          setError('Riddle not found.');
        } else {
          setError('Failed to load riddle. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isCrossword = riddle?.type?.toUpperCase() === 'CROSSWORD';

  const crosswordLayout = useMemo<CrosswordLayout | null>(() => {
    if (!riddle || !isCrossword) return null;
    try {
      return JSON.parse(riddle.content) as CrosswordLayout;
    } catch {
      return null;
    }
  }, [riddle, isCrossword]);

  const crosswordInitialAnswers = useMemo<Record<number, string> | undefined>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const progressRecord = (riddle?.crossword_progress as any)?.[0]?.progress as
      | Record<string, string>
      | undefined;
    if (!progressRecord) return undefined;
    return Object.fromEntries(
      Object.entries(progressRecord).map(([k, v]) => [Number(k), v]),
    );
  }, [riddle?.crossword_progress]);

  return (
    <div
      style={{
        maxWidth: isCrossword && crosswordLayout ? '100%' : 760,
        width: '100%',
        margin: '0 auto',
        padding: '32px 16px',
        boxSizing: 'border-box',
      }}
    >
      <Button
        variant="grey-glass-link"
        size="auto"
        onClick={() => router.back()}
        leftIcon={<ArrowLeft size={16} />}
      >
        Back
      </Button>

      <div style={{ marginTop: 24 }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: 48,
              opacity: 0.7,
            }}
          >
            <Lock size={32} />
            <p>{error}</p>
            <Link href="/pvp">Return to Arena</Link>
          </div>
        )}

        {riddle && !loading && (
          <div
            style={{
              background: 'var(--color-surface, #1a1a2e)',
              border: '1px solid var(--color-border, #333)',
              borderRadius: 16,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* ── Header row ────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BookOpen size={20} />
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>PvP Riddle</h2>
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
                {riddle.type && (
                  <Badge variant={typeToVariant(riddle.type)}>{riddle.type}</Badge>
                )}
                <ComplexityDots value={riddle.complexity} />
              </div>
            </div>

            {/* ── Optional image ─────────────────────────────────── */}
            {riddle.image_url && (
              <Image
                src={riddle.image_url}
                alt="Riddle illustration"
                width={700}
                height={400}
                style={{ width: '100%', height: 'auto', borderRadius: 10, objectFit: 'cover' }}
                unoptimized
              />
            )}

            {isCrossword && crosswordLayout ? (
              <CrosswordResult
                layout={crosswordLayout}
                isSolved={true}
                initialAnswers={crosswordInitialAnswers}
                onReset={() => {}}
                hideControls
              />
            ) : (
              <p style={{ fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>{riddle.content}</p>
            )}

            {!isCrossword && (
              <div
                style={{
                  background: 'var(--color-surface-alt, #111)',
                  border: '1px solid var(--color-border, #333)',
                  borderRadius: 10,
                  padding: '14px 18px',
                }}
              >
                <span style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Answer
                </span>
                <p style={{ margin: '6px 0 0', fontWeight: 600, fontSize: '1rem' }}>{riddle.answer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
