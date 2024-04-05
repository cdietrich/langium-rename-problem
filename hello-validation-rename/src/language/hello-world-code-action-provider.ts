import type { AstNode, LangiumDocument } from "langium"
import type { CodeActionProvider } from "langium/lsp"
import type { CodeAction } from "vscode-languageserver"
import { type CancellationToken, CodeActionKind, type CodeActionParams, type Command } from "vscode-languageserver"

export class HelloWorldActionProvider implements CodeActionProvider {
  async getCodeActions(
    _document: LangiumDocument<AstNode>,
    params: CodeActionParams,
    _cancelToken?: CancellationToken | undefined
  ): Promise<(Command | CodeAction)[] | undefined> {
    const result = []
    for (const d of params.context.diagnostics) {
      if (d.code === "xxxx") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (d.data?.expectedFileName === undefined) {
          console.error("expectedFileName unexpectedly not set")
          continue
        }
        const a: CodeAction = {
          title: "Fix file name and location",
          diagnostics: [d],
          kind: CodeActionKind.QuickFix,
          edit: {
            documentChanges: [
              {
                kind: "rename",
                oldUri: params.textDocument.uri.toString(),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                newUri: d.data?.expectedFileName as string,
              },
            ],
          },
        }
        result.push(a)
      }
    }
    return result
  }
}
