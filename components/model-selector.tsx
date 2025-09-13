'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';

import { saveChatModelAsCookie } from '@/app/(chat)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { chatModels, type ModelProvider } from '@/lib/ai/models';
import { cn } from '@/lib/utils';

import { CheckCircleFillIcon, ChevronDownIcon } from './icons';
import { entitlementsByUserType } from '@/lib/ai/entitlements';
import type { Session } from 'next-auth';

const providerDisplayNames: Record<ModelProvider, string> = {
  openai: 'OpenAI',
  google: 'Google',
  anthropic: 'Anthropic',
  xai: 'xAI',
};

export function ModelSelector({
  session,
  selectedModelId,
  className,
}: {
  session: Session;
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);

  const userType = session.user.type;
  const { availableChatModelIds } = entitlementsByUserType[userType];

  const availableChatModels = chatModels.filter((chatModel) =>
    availableChatModelIds.includes(chatModel.id),
  );

  // Group models by provider
  const modelsByProvider = useMemo(() => {
    const grouped: Record<ModelProvider, typeof availableChatModels> = {
      openai: [],
      google: [],
      anthropic: [],
      xai: [],
    };

    availableChatModels.forEach((model) => {
      grouped[model.provider].push(model);
    });

    return grouped;
  }, [availableChatModels]);

  const selectedChatModel = useMemo(
    () =>
      availableChatModels.find(
        (chatModel) => chatModel.id === optimisticModelId,
      ),
    [optimisticModelId, availableChatModels],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          data-testid="model-selector"
          variant="outline"
          className="md:px-2 md:h-[34px]"
        >
          {selectedChatModel?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[320px] max-h-[400px] overflow-y-auto">
        {(Object.keys(modelsByProvider) as ModelProvider[]).map((provider) => {
          const providerModels = modelsByProvider[provider];
          if (providerModels.length === 0) return null;

          return (
            <div key={provider}>
              <DropdownMenuLabel className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-muted-foreground">
                {providerDisplayNames[provider]}
              </DropdownMenuLabel>
              {providerModels.map((chatModel, index) => {
                const { id } = chatModel;

                return (
                  <DropdownMenuItem
                    data-testid={`model-selector-item-${id}`}
                    key={id}
                    onSelect={() => {
                      setOpen(false);

                      startTransition(() => {
                        setOptimisticModelId(id);
                        saveChatModelAsCookie(id);
                      });
                    }}
                    data-active={id === optimisticModelId}
                    asChild
                  >
                    <button
                      type="button"
                      className="gap-4 group/item flex flex-row justify-between items-center w-full"
                    >
                      <div className="flex flex-col gap-1 items-start">
                        <div className="text-sm font-medium">{chatModel.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {chatModel.description}
                        </div>
                      </div>

                      <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                        <CheckCircleFillIcon />
                      </div>
                    </button>
                  </DropdownMenuItem>
                );
              })}
              {/* Add separator between providers if not last */}
              {provider !== 'xai' && providerModels.length > 0 && <DropdownMenuSeparator />}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
