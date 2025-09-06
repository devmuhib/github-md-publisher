import { GitHubContentFetcher } from "@/components/github-content-fetcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Upload } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            GitHub Content Management System
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fetch, manage, and publish Markdown content directly from your
            GitHub repository. Create drafts locally and publish them with a
            single click.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Manage Drafts
              </CardTitle>
              <CardDescription>
                Create, edit, and organize your post drafts locally before
                publishing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/drafts">
                <Button className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Go to Drafts
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-secondary" />
                Publish Content
              </CardTitle>
              <CardDescription>
                Publish your drafts to GitHub as Markdown files in a single
                commit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/publish">
                <Button variant="secondary" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Publish Drafts
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <GitHubContentFetcher />
      </div>
    </div>
  );
}
