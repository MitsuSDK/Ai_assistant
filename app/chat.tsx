import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/components/theme';
import { ThemeToggle } from '@/components/theme-toggle';

type Role = 'user' | 'assistant';

type Message = {
  id: string;
  role: Role;
  text: string;
};

const PRIVATE_LLM_URL = 'https://your-private-llm-api.example.com/chat';
const PRIVATE_LLM_TOKEN = 'replace-with-your-token';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(PRIVATE_LLM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PRIVATE_LLM_TOKEN}`,
        },
        body: JSON.stringify({
          message: text,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data?.reply ?? 'No reply received.';

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: assistantText,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: 'assistant',
          text: 'Could not reach your LLM. Check URL/token and try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.screenBg }]}
      edges={['left', 'right', 'bottom']}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.screenBg }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ThemeToggle
          style={[styles.themeToggle, { top: Math.max(12, insets.top + 6) }]}
        />
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContent}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === 'user'
                  ? [styles.userBubble, { backgroundColor: colors.chatUserBubble }]
                  : [styles.assistantBubble, { backgroundColor: colors.chatAssistantBubble }],
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  item.role === 'user'
                    ? [styles.userBubbleText, { color: colors.chatUserText }]
                    : [styles.assistantBubbleText, { color: colors.chatAssistantText }],
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.mutedText }]}>
              Send a message to start.
            </Text>
          }
        />

        <View
          style={[
            styles.inputRow,
            {
              paddingBottom: Math.max(10, insets.bottom),
              backgroundColor: colors.inputBg,
              borderTopColor: colors.divider,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.inputBorder,
                backgroundColor: colors.inputBg,
                color: colors.inputText,
              },
            ]}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message"
            placeholderTextColor={colors.inputPlaceholder}
            editable={!loading}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <Pressable
            style={[styles.sendButton, { backgroundColor: colors.chatUserBubble }]}
            onPress={sendMessage}
            disabled={loading}
          >
            <Text style={[styles.sendText, { color: colors.chatUserText }]}>
              {loading ? '...' : 'Send'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    right: 16,
    zIndex: 5,
  },
  messagesContent: {
    padding: 16,
    gap: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
  },
  bubble: {
    maxWidth: '85%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userBubbleText: {
  },
  assistantBubbleText: {
  },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendButton: {
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    fontWeight: '600',
  },
});
